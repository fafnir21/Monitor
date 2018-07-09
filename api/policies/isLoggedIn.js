/**
 * isLoggedIn
 *
 * @module      :: Policy
 * @description :: Check if the user is logged in
 *
 */

module.exports = function(req, res, next) {
 	if(req.session.username) {
 		return next();
 	}
 	return res.redirect('/');
}