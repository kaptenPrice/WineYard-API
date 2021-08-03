import StatusCode from '../../../config/StatusCode';
import { IHandlerProps } from '../../../server';
import PasswordUtils from '../../lib/PasswordUtils';
import WineModel from '../../model/Wine.model';

/**GET requires wineId in params, shows wine from collection.wine */
const getWineById: IHandlerProps = async (req, res) => {
	try {
		const response = await WineModel.findById(req.params.wineId);
		//TODO:check this
		res.status(StatusCode.OK).send(response);
	} catch (error) {
		res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
			error: error.message,
			message: 'Error occurred while trying to retrieve user with ID:' + req.params.wineId
		});
	}
};

export default {
	get: {
		handler: getWineById,
		paramsPattern: '/:wineId',
		middleware: PasswordUtils.authVerifyByCookie
	}
};
