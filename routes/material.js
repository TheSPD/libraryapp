var express = require('express');
var router = express.Router();

var Material = require('../models/material');

// Donate
router.get('/donate', function(req, res){
	res.render('donate');
});

// Donate Book
router.post('/donate', ensureAuthenticated, function(req, res){
	var name = req.body.name;
	var author = req.body.author;
	var publicationType = req.body.publicationType;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('publicationType', 'Publication Type is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('donate',{
			errors:errors
		});
	} else {
		var newMaterial = new Material({
			name: name,
			author: author,
			publicationType: publicationType,
		});

		Material.getMaterialByName(newMaterial.name, function(existingMaterial){
			console.log(existingMaterial);
			if(existingMaterial){
				existingMaterial.set({ numCopies: existingMaterial.numCopies + 1 });
				newMaterial = existingMaterial;
			}
			else {
				newMaterial.numCopies = 1;
			}

			Material.createMaterial(newMaterial, function(err, material){
				if(err) throw err;
				console.log(material);
			});

		
		});

		req.flash('success_msg', 'You have donated. Others can now issue it.');

		res.redirect('/');
	}
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;