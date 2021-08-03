import StatusCode from '../../../config/StatusCode';
import { IHandlerProps } from '../../../server';
import PasswordUtils from '../../lib/PasswordUtils';
import { objectFilter } from '../../middleware/MiddleWares';
import WineModel from '../../model/Wine.model';

/** PATCH requires wineId, updates parameters in this.wine */
const updateWine: IHandlerProps = async (req, res) => {
	let { name, country, description, grapes, year } = req.body;
	try {
		if (!name && !country && !grapes && !year && !description) {
			return res
				.status(StatusCode.BAD_REQUEST)
				.send({ message: `Can't insert empty values.` });
		}
		const response = await WineModel.findByIdAndUpdate(
			req.params.wineId,
			objectFilter(
				{
					name,
					country,
					grapes,
					year,
					description
				},
				[null, '']
			),
			{ new: true, omitUndefined: true }
		);
		res.status(StatusCode.OK).send(response);
	} catch (error) {
		if (error.message.includes('E11000')) {
			res.status(StatusCode.FORBIDDEN).send({
				message: `${name} already exists`
			});
		} else
			res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
				message:
					'Error occurred while trying to update values of the wine with ID:' +
					req.params.wineId,
				error: error.message
			});
	}
};

export default {
	patch: {
		handler: updateWine,
		paramsPattern: '/:wineId',
		middleware: PasswordUtils.authVerifyByCookie
	}
};
