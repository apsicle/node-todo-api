var env = process.env.NODE_ENV || 'development';

// process.env.NODE_ENV gets set by package.json. On heroku, which is linux, it gets set to 
// 
if (env === 'development') {
	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
	process.env.PORT = 3000;
} else if (env === 'test') {
	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
	process.env.PORT = 3000;
}