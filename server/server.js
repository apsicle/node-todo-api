const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js');
var {ObjectID} = require('mongodb');
var {User} = require('./models/user.js');
var {Todo} = require('./models/todo.js');

var app = express();
const port = process.env.PORT || 3000;

// bodyParser... passes key-value pairs from the post request into request.body. Q: why
// isn't this done automatically by express?
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
	var todo = new Todo({
		text: req.body.text
	});

	todo.save().then((doc) => {
		res.send(doc);
	}, (err) => {
		res.status(400).send(err);
	});
});

app.get('/todos', (req, res) => {
	// find() returns a COLLECTION of documents. I.e. an array of obects.
	Todo.find().then((docs) => {
		res.send({docs: docs});
	}, (err) => {
		res.status(400).send(err);
	});
});

//GET /todos/
app.get('/todos/:id', (req, res) => {
	var id = req.params.id;
	// Validate id, send 404 if not valid.
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
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
		return res.send(err);
	});
});

app.listen(port, () => {
	console.log(`Started on port ${port}`);
});


module.exports = {
	app
};