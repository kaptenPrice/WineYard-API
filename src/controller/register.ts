import PasswordUtils from '../lib/PasswordUtils';
import path from 'path';
import UserModel from '../model/User.model';
import StatusCode from '../../config/StatusCode';
import { HandlerType } from 'express-static-router';

//sending layout to login and register
export const get: HandlerType = (req, res) => {
	if (!req.cookies?.token) {
		console.log(__dirname);
		res.sendFile(path.join(__dirname, '../../register.html'));
	} else {
		res.redirect('/profile');
	}
};

/**
 * POST
 * @param {*password, email} req
 * @param {*redirect("/login")} res
 * @param {*null} next
 */
export const post: HandlerType = async (req, res) => {
	const { salt, hash } = PasswordUtils.passwordGenerator(req.body.password);
	try {
		await new UserModel({
			email: req.body.email,
			hash,
			salt
		})
			.save()
			.then((user) => {
				res.status(StatusCode.OK).send({ message: 'Go to /login' });
			});
	} catch (err) {
		console.log(err.message);
		res.json({ success: false, msg: err });
	}
};
