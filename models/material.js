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
	}
});

var Material = module.exports = mongoose.model('Material', MaterialSchema);

module.exports.getMaterialByName = function(name, callback){
	var query = {name: name};
	
	Material.findOne(query, function (err, cb) {
		callback(cb)
	});
	
	
}

module.exports.createMaterial = function(newMaterial, callback){
	newMaterial.save(callback);
}

module.exports.getMaterialById = function(id, callback){
	Material.findById(id, callback);
}