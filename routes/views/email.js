var keystone = require('keystone');
	async = require('async');
exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Set locals
	locals.section = 'blog';
	locals.filters = {
		email: req.params.email
		//category: req.params.category
	};

}