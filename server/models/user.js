const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

	// token is created by jwt.
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

	// token is stored in the user object in the tokens array.
	user.tokens.push({
		access,
		token
	});

	return user.save().then(() => {
		return token;
	});
};

UserSchema.methods.removeToken = function(token) {
	// remove any object from the user's token array that has the same token as the one passed in
	var user = this;

	return user.update({
		$pull: {
			tokens: {
				token
			}
		}
	});
};

UserSchema.statics.findByToken = function(token) {
	// static methods get called with the model class User bound to this.
	var User = this;
	var decoded;

	try {
		// given a real token, decoded is a user object, with _id and access variables of the original
		// object, i.e. when you PUT the user object into the database, and called
		// genAuthToken, you jwt.signed it into this token value, and stored that token value
		// on the user object, modifying it before you saved it.

		// here, we are decoding that long value using jwt.verify, using a token 
		// passed in by the user inside the request header.
		decoded = jwt.verify(token, process.env.JWT_SECRET);
	} catch (err) {
		//this goes to the catch block in the next level up (authenticate.js, usually)
		return Promise.reject('Token could not be determined to be valid');
	};

	return User.findOne({
		// quotes are required when you use . properties in a find call
		// here, we are finding the original user object by the decoded _id.
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});
};

UserSchema.statics.findByCredentials = function(email, password) {
	var User = this;

	return User.findOne({email}).then((user) => {
		if (!user) {
			return Promise.reject('User not found');
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, resBool) => {
				if (resBool) {
					resolve(user);
				} else {
					reject('Password incorrect');
				}
			});
		});
	});
};

UserSchema.pre('save', function(next) {
	var user = this;

	// isModified is a method that returns true if the property passed in is modified.
	if (user.isModified('password')) {
		var salt = bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, password) => {
				user.password = password;
				next();
			})
		})
	} else {
		next();
	}
});

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