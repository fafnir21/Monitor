module.exports = function(req, res, next) {
 	if(req.session.username === 'admin') {
 		return next();
 	}
 	return res.redirect('/');
}