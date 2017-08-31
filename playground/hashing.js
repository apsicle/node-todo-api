const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

// bcrypt.genSalt(10, (err, salt) => {
// 	bcrypt.hash(password, salt, (err, hash) => {
// 		console.log(hash);
// 	});
// });

var hashedPassword = '$2a$10$.ftnKVQrzFOxwh.QPHLbV.abzUCZLf8PKZT9yahvXvtqnefEyVzPW';

bcrypt.compare(password, hashedPassword, (err, resBool) => {
	console.log('Passwords are true? ', resBool);
})

// var data = {
// 	id: 10
// };

// var token = jwt.sign(data, '123abc');
// console.log(token);

// var decoded = jwt.verify(token, '123abc');
// console.log('decoded: ', decoded);
//jwt.sign(data, '123abc');

//jwt.sign ==> hashes and returns token value
//jwt.verify ==> takes token and data and verifies it.

// var message = 'I am user number 3';
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hashed msg: ${hash}`);

// var data = {
// 	id: 4
// };

// var token = {
// 	data,
// 	hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// // once data is taken from user, it is hashed + salted and stored in tokenized format.
// // When a user makes a new request, say, changing id to 5, we re-hash and salt the data, and check if
// // it matches the token. Since the data were manipulated, the hashes don't match, and we reject the
// // request.

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// if (resultHash === token.hash) {
// 	console.log('Data were not changed');
// } else {
// 	console.log('Data were changed. Reject request');
// }