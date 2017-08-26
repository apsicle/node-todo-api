var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
	text: {
		type: String,
		required: true,
		minlength: 1,
		trim: true, //removes leading and trailing whitespace.
	},
	completed: {
		type: Boolean,
		default: false
	},
	completedAt: {
		type: Number,
		default: null
	}
});

module.exports.Todo = Todo;
// ****** Examples *******
// var newTodo = new Todo({
// 	text: 'Cook dinner'
// });

// newTodo.save().then((doc) => {
// 	console.log("Data saved: ", doc);
// }, (err) => {
// 	console.log("Unable to save todo");
// });

// var newTodo = new Todo({
// 	text: 'Eat dinner',
// 	completed: false,
// 	completedAt: Date.now()
// });

// newTodo.save().then((doc) => {
// 	console.log("Data saved: ", doc);
// }, (err) => {
// 	console.log("Unable to save todo", err);
// });

// var newTodo = new Todo({
// 	text: '   Edit this video    '
// })

// newTodo.save().then((doc) => {
// 	console.log("Data saved: ", doc);
// }, (err) => {
// 	console.log("Unable to save todo", err);
// });