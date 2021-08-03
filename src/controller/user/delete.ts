import StatusCode from '../../../config/StatusCode';
import { IHandlerProps } from '../../../server';
import PasswordUtils from '../../lib/PasswordUtils';
import UserModel from '../../model/User.model';

const deleteUserById: IHandlerProps = async (req, res) => {
	try {
		const response = await UserModel.findByIdAndDelete(req.params.userId);
		res.status(StatusCode.OK).send({
			message: `Successfully deleted: and ID ${response?._id}`
		});
	} catch (error) {
		res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
			message:
				'Error occurred while trying to find and delete user with ID:' + req.params.userId
		});
	}
};

export default {
	delete: {
		handler: deleteUserById,
		paramsPattern: '/:userId',
		middleware: PasswordUtils.authVerifyByCookie
	}
};
