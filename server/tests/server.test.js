const supertest = require('supertest');
const expect = require('expect');

const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');
const {User} = require('./../models/user');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('GET /todos', () => {
	it('Should GET all todos by first user', (done) => {
		var text;
		supertest(app)
			.get('/todos')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				expect(res.body.todos.length).toBe(1);
				done();
			});
	});
})

describe('GET /todos/:id', () => {
	it('Should GET one todo of given id', (done) => {
		supertest(app)
			.get(`/todos/${todos[0]._id}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				expect(res.body.todo.text).toBe(todos[0].text);
				done();
			});
	});

	it('Should not GET the todo created by another user', (done) => {
		supertest(app)
			.get(`/todos/${todos[1]._id}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it('Should return a 404 if todo not found', (done) => {
		supertest(app)
			.get(`/todos/${new ObjectID()}`)
			.expect(404)
			.set('x-auth', users[0].tokens[0].token)
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
			.set('x-auth', users[0].tokens[0].token)
			.expect(400)
			.end(done);
	});
})

describe('POST /todos', () => {
	it('Should create a new todo', (done) => {
		var text = 'im gonna use test todo text';
		supertest(app)
			.post('/todos')
			.set('x-auth', users[0].tokens[0].token)
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
			.set('x-auth', users[0].tokens[0].token)
			.send({text})
			.expect(400)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find().then((todos) => {
					expect(todos.length).toBe(2);
					done()
				}).catch((e) => done(e));
			});
	});
});

describe('DELETE /todos/:id', () => {
	it('Should remove a todo', (done) => {
		var id = todos[1]._id.toHexString();

		supertest(app)
			.delete(`/todos/${id}`)
			.set('x-auth', users[1].tokens[0].token)
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

	it('Should not remove another users todo', (done) => {
		var id = todos[0]._id.toHexString();

		supertest(app)
			.delete(`/todos/${id}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				Todo.findById(id).then((todo) => {
					expect(todo).toExist();
					done();
				}).catch((err) => done(err));
			});
	});

	it('Should return a 404 if todo not found', (done) => {
		var id = new ObjectID().toHexString();

		supertest(app)
			.delete(`/todos/${id}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it('Should return 400 if object ID is invalid', (done) => {
		var id = 123;

		supertest(app)
			.delete(`/todos/${id}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(400)
			.end(done);
	});
});

describe('PATCH todos/:id', () => {
	it('Should update the todo text property and completed from false to true', (done) => {
		var id = todos[0]._id.toHexString();
		var testText = 'Update the todo text prop and completed from false to true'

		supertest(app)
			.patch(`/todos/${id}`)
			.set('x-auth', users[0].tokens[0].token)
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

	it('Should not let you update the text property and completed for another user', (done) => {
		var id = todos[0]._id.toHexString();
		var testText = 'Update the todo text prop and completed from false to true'

		supertest(app)
			.patch(`/todos/${id}`)
			.set('x-auth', users[1].tokens[0].token)
			.send({text: testText, completed: true})
			.expect(404)
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
	});

	it('Should clear completedAt when todo is not completed.', (done) => {
		var id = todos[1]._id.toHexString();
		var testText = 'Clear completedAt when todo is not completed';

		supertest(app)
			.patch(`/todos/${id}`)
			.set('x-auth', users[1].tokens[0].token)
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
});

describe('GET /users/me', () => {
	it('Should return user if authenticated', (done) => {
		supertest(app)
			.get('/users/me')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email);
			})
			.end(done);
	});

	it('should return 401 if not authenticated', (done) => {
		supertest(app)
			.get('/users/me')
			.expect(401)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end(done);
	});
});

describe('POST /users', () => {
	it('should create a user given valid email + any password', (done) => {
		var email = 'example@example.com';
		var password = '123mnb!';

		supertest(app)
			.post('/users')
			.send({email, password})
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toExist();
				expect(res.body._id).toExist();
				expect(res.body.email).toBe(email);
			})
			.end((err) => {
				if (err) {
					return done(err);
				} 

				User.findOne({email}).then((user) => {
					expect(user).toExist();
					expect(user.password).toNotBe(password);
					done();
				}).catch((err) => done(err));
			});
	});

	it('should return validation errors if request is invalid', (done) => {
		var email = 'this is not an email';
		var password = 'thisisapassword?';

		supertest(app)
			.post('/users')
			.send({email, password})
			.expect(400)
			.expect((res) => {
				expect(res.headers['x-auth']).toNotExist();
			})			
			.end((err) => {
				if (err) {
					return done(err);
				}

				User.findOne({email}).then((user) => {
					expect(user).toNotExist();
					done();
				});
			});
	});

	it('Should not create user if email in use', (done) => {
		var email = users[0].email;
		var password = users[0].password;

		supertest(app)
			.post('/users')
			.send({email, password})
			.expect(400)
			.expect((res) => {
				expect(res.headers['x-auth']).toNotExist();
			})
			.end((err) => {
				if (err) {
					return done(err);
				}

				User.findOne({email}).then((user) => {
					expect(user).toExist();
					done();
				});
			});
	});
});

describe('POST /users/login', () => {
	it('should login user and return auth token', (done) => {
		supertest(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: users[1].password
			})
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toExist();
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				User.findById(users[1]._id).then((user) => {
					expect(user.tokens[1]).toInclude({
						access: 'auth',
						token: res.headers['x-auth']
					});
					done();
				}).catch((err) => done(err));
			});
	});

	it('should reject invalid login', (done) => {
		supertest(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: users[1].password + '1'
			})
			.expect(400)
			.expect((res) => {
				expect(res.headers['x-auth']).toNotExist();
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				User.findById(users[1]._id).then((user) => {
					expect(user.tokens.length).toBe(1);
					done();
				}).catch((err) => done(err));
			});
	});
});

describe('DELETE /users/me/token', () => {
	it('Should remove auth token on logout', (done) => {
		supertest(app)
			.delete('/users/me/token')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				User.findById(users[0]._id).then((user) => {
					expect(user.tokens.length).toBe(0);
					done();
				}).catch((err) => done(err));
			});
	});
});
