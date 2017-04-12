var options = {
    // initialization options;
};

var pgp = require("pg-promise")(options);
var db = pgp("postgres://postgres:ankit@localhost:5432/postgres");
var sco;

db.connect()
    .then(function (obj) {
        sco = obj;
    })
    .catch(function (error) {
        console.log(error); // display the error;
    });

module.exports = {
	db, sco
};
