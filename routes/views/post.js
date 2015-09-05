var keystone = require('keystone');
	async = require('async');
exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Set locals
	locals.section = 'blog';
	locals.filters = {
		post: req.params.post
		//category: req.params.category
	};
	locals.data = {
		posts: [],
		categories: []
	};
	
	// Load the current post
	view.on('init', function(next) {
		
		var q = keystone.list('Post').model.findOne({
			state: 'published',
			slug: locals.filters.post
		}).populate('author categories');
		
		q.exec(function(err, result) {
			locals.data.post = result;
			next(err);
		});
		
	});
	
	// Load other posts
	view.on('init', function(next) {
		
		var q = keystone.list('Post').model.find().where('state','published').sort('publishedDate').populate('author categories').limit('3');
		
		q.exec(function(err, results) {
			locals.data.posts = results;
			next(err);
		});
	});
	
	// Render the view
	view.render('post');
	
};
