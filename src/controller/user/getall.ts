import StatusCode from '../../../config/StatusCode';
import { IHandlerProps } from '../../../server';
import PasswordUtils from '../../lib/PasswordUtils';
import UserModel from '../../model/User.model';


const get: IHandlerProps = async (req, res) => {
	try {
		const response = await UserModel.find();
		res.status(StatusCode.OK).send(response);
	} catch (error) {
		res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
			message: error.message
		});
	}
};

export default {
	get: {
		handler: get,
		middleware: PasswordUtils.authVerifyByCookie
	}
};
