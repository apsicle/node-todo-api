const {MongoClient, ObjectID} = require('mongodb');


var fetchArray;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		console.log('Unable to connect to MongoDB server');
	}
	console.log('Connected to MongoDB server');

	// // deleteMany - deletes all matching. Returns {n: numberdeleted, ok: 1} ok === statuscode
	// where 1 means all good
	// db.collection('Todos').deleteMany({text: 'Eat lunch', completed: false}).then((result) => {
	// 	console.log(`result: ${result}`);
	// }, (err) => {
	// 	console.log(err);
	// });

	// // deleteOne - deletes one matching (first one). Same return as above
	// db.collection('Todos').deleteMany({text: 'Eat dinner'}).then((result) => {
	// 	console.log(`result: ${result}`);
	// }, (err) => {
	// 	console.log(err);
	// });

	// // findOneAndDelete - does the same as deleteOne but also returns 3 objects in an object:
	// // {lastErrorObject: {n: 1}, value: {your object}, ok: 1}
	// db.collection('Users').findOneAndDelete({name: "Ryan"}).then((result) => {
	// 	console.log(result);
	// }, (err) => {
	// 	console.log(err);
	// });

	// notice that if the filter doesn't match with any 
	db.collection("Users").findOneAndDelete({_id: new ObjectID("59a44c9808dd202847f966ba")}).then((result) => {
		console.log(JSON.stringify(result, undefined, 2));
	}, (err) => console.log(err));
	// db.close();
});