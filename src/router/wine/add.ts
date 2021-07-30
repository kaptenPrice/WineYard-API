/** POST requires input from body : name, country, description, grapes, year */

import StatusCode from '../../../config/StatusCode';
import { IHandlerProps } from '../../../server';
import PasswordUtils from '../../lib/PasswordUtils';
import WineModel from '../../model/Wine.model';

const addWine: IHandlerProps = async (req, res) => {
	const { name, country, description, grapes, year } = req.body;
	try {
		if (!name || !country) {
			return res
				.status(StatusCode.BAD_REQUEST)
				.send({ message: 'Cannot insert empty values' });
		}
		const response = await new WineModel({
			name,
			country,
			description,
			grapes,
			year
		}).save();
		res.status(StatusCode.CREATED).send(response);
	} catch (error) {
		res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
			message: `${name} already exists`,
			error: error.message
		});
	}
};

export default {
	post: {
		handler: addWine,
		middleware: PasswordUtils.authVerifyByCookie
	}
};
