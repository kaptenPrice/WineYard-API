import path from 'path';
import StatusCode from '../../config/StatusCode';
import PasswordUtils from '../lib/PasswordUtils';
import UserModel from '../model/User.model';

export const get = (req, res) => {
	if (!req.cookies.token) {
		res.sendFile(path.join(__dirname, '../../login.html'));
	} else {
		res.redirect('/profile');
	}
};

export const post = async (req, res) => {
	const { email, password } = await req.body;
	if (req.cookies.token) {
		res.redirect('/');
	} else {
		if (email && password) {
			try {
				const user = await UserModel.findOne({ email });
				if (!user) {
					res.status(StatusCode.UNAUTHORIZED).send({
						message: `Couldnt find user ${email},  go to /register`
					});
					return;
				}
				const isValid = PasswordUtils.passwordValidator(password, user.hash, user.salt);
				if (isValid) {
					PasswordUtils.generateJwt(user, res);
					res.send({ success: true, message: 'welcome', Goto: '/profile' });
				} else {
					res.status(StatusCode.UNAUTHORIZED).send({
						message: 'You entered wrong password'
					});
				}
			} catch (error) {
				res.status(StatusCode.BAD_REQUEST).send({
					message: 'Error in UserController.login',
					error: error.message
				});
			}
		} else {
			res.send({ message: 'Username and password is required, go to /login' });
		}
	}
};
