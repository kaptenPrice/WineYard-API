import { HandlerType } from 'express-static-router';

/**
 * GET
 * @param {*} req
 * @param {*redirect("/login")} res
 */
export const get: HandlerType = (req, res) => {
	try {
		res.clearCookie('token');
		res.redirect('/login');
	} catch (error) {
		res.send({ error: error.message, message: `Couldn't log out user` });
	}
};
