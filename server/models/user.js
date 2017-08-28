const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: false,
		trim: true,
		minlength: 1
	},
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not an email'
		}
	},
	password: {
		type: String,
		require: true,
		minlength: 6
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
});

UserSchema.methods.toJSON = function() {
	// this method is an internal method we're overriding. It is middleware that converts a mongoose
	// doc into a json when sent back in the http response to the user.
	var user = this;
	var userObject = user.toObject();

	// we don't return the password or token array to the user. They don't need it
	return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function() {
	// we're creating instance based methods here, and so we need to use the "this" keyword, identifying
	// the instance of user that we're calling the method from.

	// this returns a 
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(), access}, 'mysecretvalue').toString();

	user.tokens.push({
		access,
		token
	});

	return user.save().then(() => {
		return token;
	});
};

UserSchema.statics.findByToken = function(token) {
	// static methods get called with the model class User bound to this.
	var User = this;
	var decoded;

	try {
		decoded = jwt.verify(token, 'mysecretvalue');
	} catch (err) {
		//this goes to the catch block in server
		return Promise.reject('Token could not be determined to be valid');
	};

	return User.findOne({
		// quotes are required when you use . properties in a find call
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});
};

var User = mongoose.model('User', UserSchema);

module.exports.User = User;

// ****** Examples *******
// newUser = new User({
// 	name: 'Ryan',
// 	email: 'yan.true@gmail.com'
// });

// newUser.save().then((doc) => {
// 	console.log(JSON.stringify(doc, undefined, 2));
// }, (err) => {
// 	console.log("Sucks, error: ", err);
// });