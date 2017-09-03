const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const randoID = new ObjectID();
const randoID2 = new ObjectID();

const userOneID = new ObjectID();
const userTwoID = new ObjectID();

const users = [{
	_id: userOneID,
	email: 'andrew@example.com',
	password: 'userOnePass',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneID, access: 'auth'}, process.env.JWT_SECRET).toString()
	}]
}, {
	_id: userTwoID,
	email: 'jen@example.com',
	password: 'userTwoPass',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userTwoID, access: 'auth'}, process.env.JWT_SECRET).toString()
	}]
}];

const todos = [{
	text: 'first test kalappa', 
	_id: randoID,
	_creator: userOneID
}, {
	text: 'kafljklfawjefklwjf', 
	_id: randoID2, 
	completed: true, 
	completedAt: 333,
	_creator: userTwoID
}];

const populateTodos = (done) => {
	Todo.remove({}).then(() => {
		Todo.insertMany(todos).then(() => done());
	});
};

const populateUsers = (done) => {
	User.remove({}).then(() => {
		// insertMany does not run middleware. We save each manually to run the middleware to 
		// hash the password.
		var userOne = new User(users[0]).save();
		var userTwo = new User(users[1]).save();

		return Promise.all([userOne, userTwo]);
	}).then(() => done());
};

module.exports = {
	todos,
	populateTodos,
	users,
	populateUsers
};