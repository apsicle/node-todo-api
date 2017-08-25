const {MongoClient, ObjectID} = require('mongodb');


var fetchArray;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		console.log('Unable to connect to MongoDB server');
	}
	console.log('Connected to MongoDB server');

	// db.collection('Todos').findOneAndUpdate({
	// 	_id: new ObjectID("599f9bcd8ef5eb3b8c38fa85")
	// }, {
	// 	$set: {
	// 		completed: true
	// 	}
	// }, {
	// 		returnOriginal: false
	// }).then((results) => {
	// 	console.log(results);
	// });

	db.collection('Users').findOneAndUpdate({
		_id: new ObjectID("59a04c9808dd202848f964ba")
	}, {
		$set: {
			name: 'Ryan'
		},
		$inc: {
			age: 5
		}
	}, {
		returnOriginal: false
	}).then((results) => {
		console.log(results);
	}, (err) => {
		console.log(err);
	});

	// db.close();
});