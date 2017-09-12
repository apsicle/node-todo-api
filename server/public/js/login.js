$('#login-form').on('submit', function(e) {
	e.preventDefault();

	var url = window.location.href;
	var password = $('[name=password]').val();
	var email = $('[name=email').val();
	console.log(password, email);

	$.ajax({
		url: 'users/login',
		contentType: "application/json",
		data: JSON.stringify({
			password: password,
			email: email
		}),
		dataType: "json",
		processData: false,
		type: 'POST',
		error: function (err) {
			console.log(err);
		},
		success: function(response, status, request) {
			console.log(response);
			console.log(request.getResponseHeader('x-auth'));
		}
	});
});