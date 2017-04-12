
var CheckUserAlreadyExists = function CheckUserAlreadyExists(req, res,dbConn)
	{
		var done = false;
		var UserStatus;	
		
		var email = req.body.email;

		dbConn.db.one("SELECT * from users.data where username = $1", email)
    	.then(function (user) {
		
        	var UserStatus = user.id;			
			
			done=true;
		})
		.catch(function (error) {
			return null;
		});
		
		return UserStatus;
	 }


var userinfo = function userinfo(req, res,dbConn)
	{
		var done = false;
		var UserStatus;	
		
		var email = req.body.username;

		
		dbConn.db.one("SELECT * from users.data where username = $1", email)
    	.then(function (user) {
		
        	UserStatus = JSON.stringify({"username": user.username,"vcode": user.verification_random});		

			done = true;
		})
		.catch(function (error) {
			return null;
		});
		
		return UserStatus;
	 }

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

var saltHashPassword = function saltHashPassword(userpassword) {
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);
    console.log('UserPassword = '+userpassword);
    console.log('Passwordhash = '+passwordData.passwordHash);
    console.log('nSalt = '+passwordData.salt);
}



module.exports = {
	CheckUserAlreadyExists,saltHashPassword,userinfo
};
