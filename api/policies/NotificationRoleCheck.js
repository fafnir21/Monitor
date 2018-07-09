/**
 * roleCheck
 *
 * @module      :: Policy
 * @description :: Check if the user has the auth to manage this part
 *
 */

// a & 1000 = 1000, means the first digit of 'a' is 1, 
// which means this user can manage notifications.
var mask = 8;

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