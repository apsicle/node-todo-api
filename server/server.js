require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose.js');
var {ObjectID} = require('mongodb');
var {User} = require('./models/user.js');
var {Todo} = require('./models/todo.js');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT || 3000; // this default of 3000 is no longer needed here but keeping for learning's sake.

// bodyParser... passes key-value pairs from the post request into request.body. Q: why
// isn't this done automatically by express?
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
	var todo = new Todo({
		text: req.body.text
	});

	todo.save().then((todo) => {
		res.send(todo);
	}, (err) => {
		res.status(400).send(err);
	});
});

app.get('/todos', (req, res) => {
	// find() returns a COLLECTION of documents. I.e. an array of obects.
	Todo.find().then((todos) => {
		res.send({todos});
	}, (err) => {
		res.status(400).send(err);
	});
});

//GET /todos/
app.get('/todos/:id', (req, res) => {
	var id = req.params.id;
	// Validate id, send 404 if not valid.
	if (!ObjectID.isValid(id)) {
		return res.status(400).send();
	};

	Todo.findById(req.params.id).then((todo) => {
		if (!todo) {
			return res.status(404).send('No todo found');
		}
		// getting used to {todo} being the same as {todo: todo}.
		// also, why send this as an object wrapping an object? because easier to expand on in case
		// you need to add more properties in the future. PErsonally, I'd probably just expand
		// it when I needed to.
		res.send({todo: todo});

	}).catch((err) => {
		// If there's another error for some reason, catch it here.
		return res.status(400).send(err);
	});
});

app.delete('/todos/:id', (req, res) => {
	var id = req.params.id;

	// Validate id, send 400 if not valid.
	if (!ObjectID.isValid(id)) {
		return res.status(400).send();
	};

	Todo.findByIdAndRemove(id).then((todo) => {
		if (!todo) {
			return res.status(404).send('Could not find todo by that id');
		}

		res.send({todo});
	}).catch((err) => {
		return res.status(400).send(err);
	});
});

app.patch('/todos/:id', (req, res) => {
	var id = req.params.id;
	var body = _.pick(req.body, ['text', 'completed']);

	if (!ObjectID.isValid(id)) {
		return res.status(400).send();
	};

	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = Date.now();
	} else {
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
		if (!todo) {
			res.status(404).send();
		}

		res.send({todo});
	}).catch((err) => {
		res.status(400).send(err);
	});
});

//stuff in this section. x- prefix on the header means custom header
//we don't pass user into the first then call because the result of the user.save promise
//is exactly the same as the user object that we just created.
app.post('/users', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);
	var user = new User(body);

	user.save().then(() => {
		return user.generateAuthToken();
	}).then((token) => {
		res.header('x-auth', token).send(user);
	}).catch((err) => {
		res.status(400).send(err);
	});
});

// authenticate is middleware that authenticates the request
app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});


app.listen(port, () => {
	console.log(`Started on port ${port}`);
});


module.exports = {
	app
};