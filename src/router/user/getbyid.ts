import StatusCode from '../../../config/StatusCode';
import { IHandlerProps } from '../../../server';
import PasswordUtils from '../../lib/PasswordUtils';
import UserModel from '../../model/User.model';

const getUserById: IHandlerProps = async (req, res) => {
	try {
		const response = await UserModel.findById(req.params.userId);
		res.status(StatusCode.OK).send(response);
	} catch (error) {
		res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
			error: error.message,
			message: 'Error occurred while trying to retrieve user with ID:' + req.params.userId
		});
	}
};

export default {
	get: {
		handler: getUserById,
		paramsPattern: '/:userId',
		middleware: PasswordUtils.authVerifyByCookie
	}
};
