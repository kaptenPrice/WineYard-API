import StatusCode from '../../../config/StatusCode';
import { IHandlerProps } from '../../../server';
import PasswordUtils from '../../lib/PasswordUtils';
import UserModel from '../../model/User.model';

const handleResetPassword: IHandlerProps = async (req, res) => {
	const resetPasswordToken = req.params.resetPasswordToken;
	const user = await UserModel.findOne({
		resetPasswordToken,
		resetPasswordExpires: {
			$gt: Date.now()
		}
	});
	if (user === null) {
		console.log('Password reset link is invalid or out of date');
		res.status(StatusCode.BAD_REQUEST).json('Password reset link is invalid or to old');
	} else {
		try {
			const { salt, hash } = PasswordUtils.passwordGenerator(req.body.password);
			await user.updateOne(
				{
					hash,
					salt,
					resetPasswordToken: null,
					resetPasswordExpires: null
				},
				{ new: true }
			);
			res.send({ success: true, message: 'Go to /login' });
		} catch (error) {
			console.log(error.message);
		}
	}
};

export default {
	get: {
		handler: handleResetPassword,
		paramsPattern: '/:resetPasswordToken'
	}
};
