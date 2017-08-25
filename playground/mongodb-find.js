const {MongoClient, ObjectID} = require('mongodb');


var fetchArray;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		console.log('Unable to connect to MongoDB server');
	}
	console.log('Connected to MongoDB server');

	// var mongoCursor = db.collection('Todos').find({completed: false});
	// var data = mongoCursor.toArray().then((docs) => {
	// 	console.log('Todos');
	// 	console.log(JSON.stringify(docs, undefined, 2));
	// }, (err) => {
	// 	console.log('Unable to fetch Todos', err)
	// });

	// db.collection('Todos').find(new ObjectID("599f9bcd8ef5eb3b8c38fa85")).toArray().then((docs) => {
	// 	console.log('Todos');
	// 	console.log(JSON.stringify(docs, undefined, 2));
	// }, (err) => {
	// 	console.log('Unable to fetch Todos', err)
	// });


	db.collection('Users').find({name: 'Ryan'}).count().then((num) => {
		console.log(`Counts: ${num}`);
	}, (err) => {
		console.log('Unable to fetch counts', err);
	});

	db.collection('Users').find({name: 'Ryan'}).toArray().then((docs) => {
		console.log(JSON.stringify(docs, undefined, 2));
	}, (err) => {
		console.log('Unable to fetch Users', err);
	});

	// db.close();
});