import StatusCode from '../../config/StatusCode.js'

export const isAuth = (req, res, next) => {
	req.isAuthenticated()
		? next()
		: res
			.status(StatusCode.UNAUTHORIZED)
			.send( '<P>You have to log in <a href=/login>login</a></p>')
}
export const isAdmin = (req, res, next) => {
	req.isAuthenticated() && req.user.admin
		? next()
		: res.status(StatusCode.UNAUTHORIZED).send({
			msg: 'You are not authorized to view this resource because you are not logged in as admin.'
		})
}
