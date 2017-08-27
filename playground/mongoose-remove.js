const {ObjectID} = require("mongodb");

const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");
const {User} = require("./../server/models/user");

var id = "59a1ad6d8d63b3842a0db513";

// removes all records matching object passed in. Returns ok: 1, n: 3. Doesn't return obj.
Todo.remove({}).then((result) => {
	console.log(result);
});

// this returns the document, and removes it
Todo.findOneAndRemove()

// this returns the document too. It's just an easier way to do it if you have the ObjectID.
Todo.findByIdAndRemove()