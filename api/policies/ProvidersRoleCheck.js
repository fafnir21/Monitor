/**
 * roleCheck
 *
 * @module      :: Policy
 * @description :: Check if the user has the auth to manage this part
 *
 */

// a & 0010 = 0010, means the third digit of 'a' is 1, 
// which means this user can manage providers.
var mask = 2;

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