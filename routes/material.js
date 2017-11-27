var express = require('express');
var router = express.Router();

var Material = require('../models/material');
var User = require('../models/user');


// Available Materials
router.get('/availableMaterial', ensureAuthenticated, function (req, res) {
	
	Material.getAllMaterials(function(materials){

		res.render('availableMaterial', {
			materials : materials
		});
	})

})


// Available Materialss
router.post('/availableMaterial', ensureAuthenticated, function (req, res) {
	var name = req.body.name;


	Material.getMaterialByPattern(name, function(materials){

		res.render('availableMaterial', {
			materials : materials
		});
	})

})

// Issue material
router.get('/issue/:id', ensureAuthenticated, function (req, res) {
	Material.getMaterialById(req.params.id, function(material){
		

		if(material.issuedUser.length - material.numCopies > 0){
			let user = req.user

			material.issuedUser.push(user)
			user.issuedMaterial.push(material)

			material.save()
			user.save()

			req.flash('success_msg', 'You have issued a ' + material.publicationType 
				+ ' by ' + material.author 
				+ ' with title ' + material.name);
			
			res.redirect('/');
		}
		else {
			req.flash('error_msg', 'You cannot issue ' + material.publicationType 
				+ ' by ' + material.author 
				+ ' with title ' + material.name + ' as there are no copies available.');
			
			res.redirect('/');
		}
	})
})

// Donate
router.get('/donate', ensureAuthenticated, function(req, res){
	res.render('donate');
});

// Donate Material
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
			if(existingMaterial){
				existingMaterial.set({ numCopies: existingMaterial.numCopies + 1 });
				newMaterial = existingMaterial;
			}
			else {
				newMaterial.numCopies = 1;
			}

			Material.createMaterial(newMaterial, function(err, material){
				if(err) throw err;
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
		req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;