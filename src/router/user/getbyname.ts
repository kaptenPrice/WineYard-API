import StatusCode from '../../../config/StatusCode';
import { IHandlerProps } from '../../../server';
import PasswordUtils from '../../lib/PasswordUtils';
import UserModel from '../../model/User.model';

//TODO:check this
const getUserByUserNameQuery: IHandlerProps = async (req, res) => {
	try {
		const response = await UserModel.find({
			username: req.params.username
		});
		response.length !== 0
			? res.status(StatusCode.OK).send(response)
			: res.status(StatusCode.NOTFOUND).send({
					message: `Couldn't find user ` + req.params.username
			  });
	} catch (error) {
		res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
			error: error.message,
			message:
				'Error occurred while trying to retrieve user with username:' + req.params.userName
		});
	}
};

export default {
	get: {
		handler: getUserByUserNameQuery,
		paramsPattern: '/:username',
		middleware: PasswordUtils.authVerifyByCookie
	}
};
