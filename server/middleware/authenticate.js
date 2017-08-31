var {User} = require('./../models/user');

var authenticate = (req, res, next) => {
	var token = req.header('x-auth');

	User.findByToken(token).then((user) => {
		if (!user) {
			return Promise.reject('user could not be found');
		} 

		req.user = user;
		req.token = token;
		next();
	}).catch((err) => {
		// an error is thrown if the findByToken fails to find a user. Though this could happen for
		// several reasons, then
		res.status(401).send(err);
	});
}

module.exports = {
	authenticate
};