/**
 * roleCheck
 *
 * @module      :: Policy
 * @description :: Check if the user has the auth to manage this part
 *
 */

// a & 0100 = 0100, means the second digit of 'a' is 1, 
// which means this user can manage forum posts.
var mask = 4;

module.exports = function(req, res, next) {
	var role = req.session.role;
 	if(role) {
 		var result = role & mask;
 		if(result === mask){
 			return next();
 		}
 	}
 	return res.redirect('/');
}