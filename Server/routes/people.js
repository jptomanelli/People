var express = require('express');
var User = require('../models/user');
var Promise = require("bluebird");
Promise.promisifyAll(require("mongoose"));
var router = express.Router();

//	GET /people
router.get('/', function(req, res, next) {
	User.find({}, function(err, users) {
		var userMap = {};
		var ctr = 1;
		users.forEach((user) => {
			userMap[ctr] = {
				_id: ctr,
				name: user.name,
				favoriteCity: user.favoriteCity
			}
			ctr++;
		});
		res.json(userMap);
	});
});

//	POST /people
router.post('/', function(req, res, next) {
	var name = req.body.name;
	var favoriteCity = req.body.favoriteCity;
	if (name != '' && favoriteCity != '') {
		var newUser = User({
			name: name,
			favoriteCity: favoriteCity
		});
		newUser.save();
		var user = {
			_id: newUser._id,
			name: newUser.name,
			favoriteCity: newUser.favoriteCity
		}
		res.json(user);
	} else {
		res.status(400).json({
			status: 400,
			response: 'Error: Bad fields. user : "name" & favoriteCity: "city"'
		});
	}
});

//	PUT /people
router.put('/', function(req, res, next) {
	res.status(201).json({
		status: 201,
		response: 'Error: Can not /PUT to /people. Go to /people/{id} to edit a persons info'
	});
});

//	DELETE /people
router.delete('/', function(req, res, next) {
	User.remove({}, function(err) {
		console.log('Users removed');
		res.status(200).json({
			status: 200,
			response: 'All people deleted'
		});
	});
});

//	GET people/id
router.get('/:id', function(req, res, next) {
	var id = req.params.id;
	var promise = User.find({}).sort({
		_id: 1
	}).exec();
	promise.then((user) => {
			if (0 < id && id <= user.length) {
				res.status(200).json({
					name: user[id - 1].name,
					favoriteCity: user[id - 1].favoriteCity
				});
			} else {
				res.status(400).json({
					status: 400,
					response: 'Error: Out of range'
				});
			}
		})
		.catch((err) => {
			console.log(err);
		});
});

//	POST /people/id
router.post('/:id', function(req, res, next) {
	res.status(400).json({
		status: 400,
		response: 'Error: To POST do so in /people. If youd like to edit a user then use PUT in /people/{id}'
	});
});

//	PUT /people/id
router.put('/:id', function(req, res, next) {
	var id = req.params.id;
	var promise = User.find({}).sort({
		_id: 1
	}).exec();
	promise.then((user) => {
			if (0 < id && id <= user.length) {
				var _id = (user[id - 1]);
				User.findById(_id, (err, user) => {
					if (err) {
						res.status(500).json({
							status: 500,
							response: err
						});
					} else {
						user.name = req.body.name || user.name;
						user.favoriteCity = req.body.favoriteCity || user.favoriteCity;
						user.save((err, user) => {
							if (err) {
								res.status(500).json({
									status: 500,
									response: err
								});
							}
							res.status(201).json({
								name: user.name,
								favoriteCity: user.favoriteCity
							});
						});
					}
				});
			} else {
				res.status(400).json({
					status: 400,
					response: 'Error: out of range'
				});
			}
		})
		.catch((err) => {
			console.log(err);
		});
});

//	DELETE /people/id
router.delete('/:id', function(req, res, next) {
	var id = req.params.id;
	var promise = User.find({}).sort({
		_id: 1
	}).exec();
	promise.then((user) => {
			if (0 < id && id <= user.length) {
				var _id = (user[id - 1]._id);
				User.findByIdAndRemove(_id, (err, user) => {
					res.status(200).json({
						status: 200,
						response: 'Successfully deleted'
					});
				});
			} else {
				res.status(400).json({
					status: 400,
					response: 'Error: out of range'
				});
			}
		})
		.catch((err) => {
			console.log(err);
		});
});

module.exports = router;
