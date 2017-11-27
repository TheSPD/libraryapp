var mongoose = require('mongoose');


// Material Schema
var MaterialSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		index: true
	},
	author: {
		type: String
	},
	publicationType: {
		type: String
	},
	numCopies: {
		type: Number,
		required: true,
	},
	issuedUser: [{type : mongoose.Schema.ObjectId, ref : 'User'}]

});

var Material = module.exports = mongoose.model('Material', MaterialSchema);

module.exports.getMaterialByName = function(name, callback){
	var query = {name: name};
	
	Material.findOne(query, function (err, cb) {
		callback(cb)
	});
	
}

module.exports.getMaterialByPattern = function(name, callback){
	var query = {name: { $regex: new RegExp('.*'+name+'.*', "i") }};
	
	Material.find(query, function (err, cb) {
		callback(cb)
	});
	
}

module.exports.getAllMaterials = function (callback) {
	Material.find({}, function(err, materials){
		callback(materials)
	})
}

module.exports.createMaterial = function(newMaterial, callback){
	newMaterial.save(callback);
}

module.exports.getMaterialById = function(id, callback){

	Material.findById(id, function(err, cb){
		callback(cb)
	});
}

module.exports.getMaterialsByIds = function (ids, callback) {
	let query = { _id: { $in : ids}}

	Material.find(query, function(err, cb){
		callback(cb)
	})
}

module.exports.removeUser = function(materialId, userId, callback){

	Material.getMaterialById(materialId, function(material, callback){
		material.issuedUser.splice(material.issuedUser.indexOf(userId), 1)
		material.save(callback)
	})
}