const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");
const {User} = require("./../server/models/user");

var id = "59a1ad6d8d63b3842a0db513";

// returns all found, in an array. Empty array if none found
// Todo.find({
// 	_id: id
// }).then((todos) => {
// 	console.log('Todos', todos);
// });

// // only returns first one, as an object. null if none found.
// Todo.findOne({
// 	_id: id
// }).then((todo) => {
// 	console.log('Todo', todo);
// });

// // only returns first one, as an object. null if none found. Just an
// // easier way to find vs. findOne if you're using id
// Todo.findById(id).then((todo) => {
// 	console.log('TodoById', todo);
// });

Todo.findById(id).then((todo) => {
	if (!todo) {
		return console.log('No todo found.');
	}

	console.log('TodoById', todo);
}).catch((err) => {
	return console.log(err);
});