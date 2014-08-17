function switcher(req, res, next){
	if(req.session.passport.user){
		req.user = req.session.passport.user;
		}
		next();
	}
	
module.exports = switcher;
