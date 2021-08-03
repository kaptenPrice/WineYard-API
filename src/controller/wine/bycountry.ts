import StatusCode from '../../../config/StatusCode';
import { IHandlerProps } from '../../../server';
import PasswordUtils from '../../lib/PasswordUtils';
import WineModel from '../../model/Wine.model';

/**GET requires country in params, shows wine from collection.wine */
const getWineByCountry: IHandlerProps = async (req, res) => {
	const { country } = req.params;
	try {
		const response = await WineModel.find({ country });
		response.length !== 0
			? res.status(StatusCode.FOUND).send(response)
			: res.status(StatusCode.NOTFOUND).send({
					message: `Couldnt find any wines from  ${country}`
			  });
	} catch (error) {
		res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
			error: error.message,
			message: `Error occured while trying to retrieve ${country}`
		});
	}
};

export default {
	get: {
		handler: getWineByCountry,
		paramsPattern: '/:country',
		middleware: PasswordUtils.authVerifyByCookie
	}
};
