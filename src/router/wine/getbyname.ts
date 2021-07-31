import StatusCode from '../../../config/StatusCode';
import { IHandlerProps } from '../../../server';
import PasswordUtils from '../../lib/PasswordUtils';
import WineModel from '../../model/Wine.model';

const getWineByName: IHandlerProps = async (req, res) => {
	const { name } = req.params;
	try {
		const response = await WineModel.find({ name: name.toUpperCase() });
		response.length !== 0
			? res.status(StatusCode.FOUND).send(response)
			: res.status(StatusCode.NOTFOUND).send({
					message: `Couldn't find wine ${name}`
			  });
	} catch (error) {
		res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
			error: error.message,
			message: `Error occurred while trying to retrieve ${name}`
		});
	}
};

export default {
	get: {
		handler: getWineByName,
		paramsPattern: '/:name',
		middleware: PasswordUtils.authVerifyByCookie
	}
};
