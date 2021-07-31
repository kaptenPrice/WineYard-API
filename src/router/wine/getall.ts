import StatusCode from '../../../config/StatusCode';
import { IHandlerProps } from '../../../server';
import PasswordUtils from '../../lib/PasswordUtils';
import WineModel from '../../model/Wine.model';

const getAllWines: IHandlerProps = async (req, res) => {
	try {
		const response = await WineModel.find();
		res.status(StatusCode.OK).send(response);
	} catch (error) {
		res.status(StatusCode.INTERNAL_SERVER_ERROR).send({ message: error.message });
	}
};

export default {
	get: {
		handler: getAllWines,
		middleware: PasswordUtils.authVerifyByCookie
	}
};
