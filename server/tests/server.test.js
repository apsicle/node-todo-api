const supertest = require('supertest');
const expect = require('expect');

const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const randoID = new ObjectID();
const todos = [{text: 'first test kalappa', _id: randoID}, {text: 'kafljklfawjefklwjf'}, {text: 'krappa'}];

beforeEach((done) => {
	Todo.remove({}).then(() => {
		Todo.insertMany(todos).then(() => done());
	});
});

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

	it('Should GET all todos', (done) => {
		var text;
		supertest(app)
			.get('/todos')
			.expect(200)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				expect(res.body.docs.length).toBe(3);
				done();
			});
	});

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

	it('Should return a 404 for non-object / non-valid id', (done) => {
		supertest(app)
			.get(`/todo/123`)
			.expect(404)
			.end(done);
	});
});