const util = require('util');
var express = require('express');
var router = express.Router();
var dbConn = require('./db');
var modelfun = require('./functionmodel');   // for define functions 

var scrypt = require("pbkdf2-sha256");
var crypto = require('crypto');

const nodemailer = require('nodemailer');
const smtpTransport = nodemailer.createTransport({
							service: "gmail",
							host: "gsmtp.gmail.com",
							auth: {
							user: "nanowebtech16@gmail.com",
							pass: "Techguru#!16admin"
							}
							});

// For clients who want to activate users manually (by system administrator) we set this to 0. Otherwise its 1. Users will be active as they signup and verify their email.
var AutoActive = 1;
var ServerSignature = "ENPAST API Server - v1";


// End call this function during registration

/* GET / page. */
router.get('/api', function(req, res, next) {
  res.end(ServerSignature);
});

router.get('/', function(req, res, next) {
  res.end(ServerSignature);
});


// email verification

	router.post('/api/everification', function(req, res, next) {
		
		res.setHeader("Content-Type", "application/json");
		
		var done = false;
		
		var sucess_response = JSON.stringify({"return_code": 1000,"error_status": 0, "status_msg" : "SUCCESS","msg" : "Successfully Verified" });	
		

		dbConn.db.one("Update users.data set is_verified = 1, verification_time = now() where verification_random = $1",req.body.vtoken).then(function () {					
			done = true;
			res.end(sucess_response);
			return;
		});	

		res.end(sucess_response);
	});

// end email verification

// Reset Password

router.post('/api/resetpass', function(req, res, next) {
	
	res.setHeader("Content-Type", "application/json");
	
	var sucess_response 	= JSON.stringify({"return_code": 1000,"error_status": 0, "status_msg" : "SUCCESS","msg" : "Successfully Reset Password" });   // Username and password is correct
	var err_response_reset  = JSON.stringify({"return_code": 1001,"error_status": 1, "status_msg" : "FAIL","msg" : "Try Again For Reset Password" });   // Not Reset
	var err_response 		= JSON.stringify({"return_code": 1002,"error_status": 1, "status_msg" : "FAIL","msg" : "Invalid password"});     // Invalid username or password
	var err_response_fields = JSON.stringify({"return_code": 1003,"error_status": 1, "status_msg" : "FAIL","msg" : "Empty Fields"});     // Invalid username or password
	
	if ( (!req.body.email) || (!req.body.PASSWORD_HASH) || (!req.body.RESET_HASH_Password) )
	{
		res.end(err_response_fields);
		return;
	}

	var email 				= req.body.email;
	var password 			= req.body.PASSWORD_HASH;
	var RESET_HASH_Password = req.body.RESET_HASH_Password;

	var done 		= false;
	var key_stack 	= "";
	done 			= false;

	dbConn.db.one("SELECT * from users.data where username = $1", email)
    .then(function (user) {
		
        var FoundID = user.id;
        var PWDHash = user.password;
        var salt 	= user.usersalt;     
        var verification_random 	= user.verification_random;     

		
        if (FoundID.length > 5)
		{					

			var result = scrypt(req.body.PASSWORD_HASH, salt, 1, 64);						

		

			if (PWDHash == result.toString('hex'))
			{				
				// RESET PASSWORD WORKING
				
					var randomsalt 			= crypto.randomBytes(16).toString('hex');					
					var newpassword 		= scrypt(RESET_HASH_Password, randomsalt, 1, 64);
					newpassword 			= newpassword.toString('hex');				

					dbConn.db.one("Update users.data set password = $1, usersalt = $2 where verification_random = $3",[newpassword,randomsalt,verification_random]).then(function (retvals) {
										
						res.end(sucess_response);

					})
					.catch(function (error) {
			            
							//console.log(error);
							res.end(err_response_reset);
					});

					res.end(err_response_reset);				
			}
			else

				res.end(err_response);
		}
			else
				res.end(err_response);
    })
    .catch(function (error) {

    	console.log(error);
        res.end(err_response);

    });
	

});


/* end Reset Password */



/*******************************************
	CheckUser / Login API call 
	
	Response: {return_code: 1001} // Login successful. Also SSID cookie should be set now. Store and use the Cookie
	Response: {return_code: 1002} // Invalid username or password
	Response: {return_code: 1003} // Username + Password is correct, but user is not active yet
	Response: {return_code: 1004} // Username + Password is correct, but email is not verified

*******************************************/



router.post('/api/check_user', function(req, res, next) {

	res.setHeader("Content-Type", "application/json");

	var sucess_response = JSON.stringify({"return_code": 1000,"error_status": 0, "status_msg" : "SUCCESS","msg" : "redirect on main screen" });   // Username and password is correct
	var err_response = JSON.stringify({"return_code": 1001,"error_status": 1, "status_msg" : "FAIL","msg" : "Invalid username or password"});     // Invalid username or password
	var notactive_response = JSON.stringify({"return_code": 1002,"error_status": 1, "status_msg" : "FAIL","msg" : "Contact to Administrator"});   // Username + Password is correct, but user is not active yet
	var notverified_response = JSON.stringify({"return_code": 1003,"error_status": 1, "status_msg" : "FAIL","msg" : "Verify your Email Id"});     // Username + Password is correct, but email is not verified

	if ( (!req.body.email) || (!req.body.PASSWORD_HASH) )
	{
		res.end(err_response);
		return;
	}

	var email = req.body.email;
	var password = req.body.PASSWORD_HASH;

	var done = false;
	var key_stack = "";
	done = false;
	dbConn.db.one("SELECT * from users.data where username = $1", email)
    .then(function (user) {
		
        var FoundID = user.id;
        var PWDHash = user.password;
        var salt 	= user.usersalt;
        key_stack 	= user.key_stack;

		
        if (FoundID.length > 5)
		{
			if (user.is_active == 0)
			{
				res.end(notactive_response);
				return;
			}

			if (user.is_verified == 0)
			{
				res.end(notverified_response);
				return;
			}			

			var result = scrypt(req.body.PASSWORD_HASH, salt, 1, 64);						

			if (PWDHash == result.toString('hex'))
			{
				var UserData = JSON.stringify({"firstname": user.firstname, "lastname": user.lastname, "email": user.username, "uid": FoundID});
				res.end(sucess_response);
				return;
			}
			else
				res.end(err_response);
		}
			else
				res.end(err_response);
    })
    .catch(function (error) {
				
        res.end(err_response);
    });


});


						/*******************************************

							Registration API 
							
							Response: {return_code: 1000} // User created. Now verify your email and wait for your account to be activated.
							Response: {return_code: 1005} // email, password, firstname or lastname field is missing
							Response: {return_code: 1006} // Username/email already exists
							
							For now as we don't send out email, user should manually set is_verified == 1

							Run this:
								Update users.data set is_verified = 1;

						*******************************************/


						

router.post('/api/create_user', function(req, res, next) {
	res.setHeader("Content-Type", "application/json");


	var missing_param_response = JSON.stringify({"return_code": 1005,"error_status": 1, "msg" : "Field is missing" });  // email, password, firstname or lastname field is missing
	var success_response = JSON.stringify({"return_code": 1000,"error_status": 0, "msg" : "Success ! Now Verify Your Email"});  // user created. Now activate and verify your email
	var userexists_response = JSON.stringify({"return_code": 1006,"error_status": 1, "msg" : "Email Id already exists"});  // username/email already exists

			if ( (!req.body.email) || (!req.body.PASSWORD_HASH) || (!req.body.firstname) || (!req.body.lastname) )
			{
				res.end(missing_param_response);
				return;
			}

	// check user already registered or not

		var emailStatus =  modelfun.CheckUserAlreadyExists(req, res,dbConn);

		if (emailStatus == null || emailStatus == "")
		{
				var randomsalt 			= crypto.randomBytes(16).toString('hex');
				var verification_token  = crypto.randomBytes(32).toString('hex');
				var password 			= scrypt(req.body.PASSWORD_HASH, randomsalt, 1, 64);
				password 				= password.toString('hex');

				dbConn.db.none("Insert into users.data (firstname, lastname, username, password, usersalt, is_active, is_verified, twofactor_stat, verification_random, hashpass) values ($1, $2, $3, $4, $5, $6, 0, 0, $7,$8)", [req.body.firstname, req.body.lastname, req.body.email, password, randomsalt, AutoActive, verification_token,req.body.PASSWORD_HASH])
				.then(function () {
				res.end(success_response);
				// ** TODO
					// NOW WE SEND EMAIL TO USER WITH verification_token in it

						// EMAIL VERIFICATION CODE							

							var verification_html = '<div style="width:700px; height:auto; margin:auto;   box-shadow: 0px 8px 5px #888888;">';
							verification_html += '<p> Hi '+req.body.firstname+' , </p>';
							verification_html += '<p>  Enpast Confirmation Mail <a href=https://localhost/#!/login?vid='+verification_token+'" > Click here to confirm  </a> </p>';
								


							var mailOptions={
							to : req.body.email,
							subject : 'Enpast Confirmation Mail',
							html : verification_html
							}

							console.log(mailOptions);

							smtpTransport.sendMail(mailOptions, function(error, response){
							if(error){
							console.log(error);
							res.end("error");
							}else{
							console.log("Message sent: " + response);
							res.end("sent");
							}
							});


						// END EMAIL VERIFICATION CODE
				// **
				})
				.catch(function (error) {
				console.log(error);
				res.end(userexists_response);
				});
		}
		else
		{
			res.end(userexists_response);
			return;
		}
	 // end 

});  

            
            
module.exports = router;
