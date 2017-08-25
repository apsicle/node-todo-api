const {MongoClient, ObjectID} = require('mongodb');

// You can also generate ObjectID's on the fly
// var ID = new ObjectID();
// console.log(ID);
// Object Destructuring - {nameOfProperty} = nameOfObject
// Extracts property and puts in a variable.
// var user = {name: 'andrew', age: 25};
// var {name} = user;
// console.log(name); 

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		console.log('Unable to connect to MongoDB server');
	}
	console.log('Connected to MongoDB server');

	// db.collection('Todos').insertOne({
	// 	text: 'Something to do',
	// 	completed: false
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('Unable to insert todo', err);
	// 	}

	// 	console.log(JSON.stringify(result.ops, undefined, 2));
	// });

	// db.collection('Users').insertOne({
	// 	name: 'Ryan',
	// 	age: '23',
	// 	location: 'Washington, DC'
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('Unable to insert todo', err);
	// 	}

	// 	console.log(result.ops[0]._id.getTimestamp());
	// })

	db.close();
});