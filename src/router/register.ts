import { Response } from 'express';
import PasswordUtils, { RequestType } from '../lib/PasswordUtils';
import path from 'path';
import UserModel from '../model/User.model';
import StatusCode from '../../config/StatusCode';

export const get = (req: RequestType, res: Response) => {
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
export const post = async (req: RequestType, res: Response) => {
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
