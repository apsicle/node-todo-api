const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js');
var {User} = require('./models/user.js');
var {Todo} = require('./models/todo.js');

var app = express();

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

	console.log(req.body);
});

app.listen(3000, () => {
	console.log(`Started on port 3000`);
});


module.exports = {
	app
};