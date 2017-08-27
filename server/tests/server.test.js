const supertest = require('supertest');
const expect = require('expect');

const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const randoID = new ObjectID();
const randoID2 = new ObjectID();
const todos = [{text: 'first test kalappa', _id: randoID}, {text: 'kafljklfawjefklwjf', _id: randoID2, completed: true, completedAt: 333}, {text: 'krappa'}];

beforeEach((done) => {
	Todo.remove({}).then(() => {
		Todo.insertMany(todos).then(() => done());
	});
});

describe('GET /todos', () => {
	it('Should GET all todos', (done) => {
		var text;
		supertest(app)
			.get('/todos')
			.expect(200)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				expect(res.body.todos.length).toBe(3);
				done();
			});
	});
})

describe('GET /todos/:id', () => {
	it('Should GET one todo of given id', (done) => {
		supertest(app)
			.get(`/todos/${randoID}`)
			.expect(200)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				expect(res.body.todo.text).toBe(todos[0].text);
				done();
			});
	});

	it('Should return a 404 if todo not found', (done) => {
		supertest(app)
			.get(`/todos/${new ObjectID()}`)
			.expect(404)
			.end((err, res) => {
				// this .end() function and below are the same
				if (err) {
					return done(err);
				}
				done();
			});
	});

	it('Should return a 400 for non-object / non-valid id', (done) => {
		supertest(app)
			.get(`/todos/123`)
			.expect(400)
			.end(done);
	});
})

describe('POST /todos', () => {
	it('Should create a new todo', (done) => {
		var text = 'im gonna use test todo text';
		supertest(app)
			.post('/todos')
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				} 

				Todo.find({text}).then((todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((e) => done(e));
			});
	});

	it('Should not create a new todo with invalid body data', (done) => {
		var text;
		supertest(app)
			.post('/todos')
			.send({text})
			.expect(400)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find().then((todos) => {
					expect(todos.length).toBe(3);
					done()
				}).catch((e) => done(e));
			});
	});
});

describe('DELETE /todos/:id', () => {
	it('Should remove a todo', (done) => {
		var id = randoID.toHexString();

		supertest(app)
			.delete(`/todos/${id}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo._id).toBe(id);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				Todo.findById(id).then((todo) => {
					expect(todo).toNotExist();
					done();
				}).catch((err) => done(err));
			});
	});

	it('Should return a 404 if todo not found', (done) => {
		var id = new ObjectID().toHexString();

		supertest(app)
			.delete(`/todos/${id}`)
			.expect(404)
			.end(done);
	});

	it('Should return 400 if object ID is invalid', (done) => {
		var id = 123;

		supertest(app)
			.delete(`/todos/${id}`)
			.expect(400)
			.end(done);
	});
});

describe('PATCH todos/:id', () => {
	it('Should update the todo text property and completed from false to true', (done) => {
		var id = randoID.toHexString();
		var testText = 'Update the todo text prop and completed from false to true'

		supertest(app)
			.patch(`/todos/${id}`)
			.send({text: testText, completed: true})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(testText);
				expect(res.body.todo.completed).toBe(true);
				expect(res.body.todo.completedAt).toBeA('number');
			})
			.end(done);
		// grab id of first item
		//make patch request
		// send to send some data with request body
		// update the text to whatever
		// set completed === true
		// make assertions
		// basic: 200 status
		// custom: verify that the response body has a text property === to text sent in
		// verify that completed is true
		// verify that completed at is a number.
	})

	it('Should clear completedAt when todo is not completed.', (done) => {
		var id = randoID2.toHexString();
		var testText = 'Clear completedAt when todo is not completed';

		supertest(app)
			.patch(`/todos/${id}`)
			.send({text: testText, completed: false})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(testText);
				expect(res.body.todo.completed).toBe(false);
				expect(res.body.todo.completedAt).toNotExist();
			})
			.end(done);		
		// grab id of second todo item
		// make patch request
		// set text to wahtever.
		// set completed to false
		// make assertions
		// check completed is false
		// check completedAt is null.
	})
})