var mongoose = require('mongoose');

var User = mongoose.model('User', {
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
		minlength: 1
	}
});

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