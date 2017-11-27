var express = require('express');
var router = express.Router();

var Material = require('../models/material');
var User = require('../models/user');

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	let user = req.user;

	Material.getMaterialsByIds(user.issuedMaterial, function(materials){
		res.render('index', {
			materials : materials
		});	
	})
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