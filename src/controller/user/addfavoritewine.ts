import { Response } from 'express';
import StatusCode from '../../../config/StatusCode';
import PasswordUtils, { RequestType } from '../../lib/PasswordUtils';
import UserModel from '../../model/User.model';
import WineModel, { IWine } from '../../model/Wine.model';

/**PATCH requires wineId,  Adds this.wine to this.user favoritwines */
/**
 *User functions
 * @param {*Wine ID} req
 * @param {*Authenticateduser.favoriteWines} res
 */
const patch = async (req: RequestType | any, res: Response) => {
	try {
		//TODO:check this
		type WineProps = Pick<IWine, 'name' | '_id' | 'country'>;

		const favoriteWine = await WineModel.findById(req.params.wineId);

		const { name, _id, country, description, grapes, year }: any | null = favoriteWine;

		const authenticatedUser = await UserModel.findOneAndUpdate(
			req.jwt.sub,
			{
				$addToSet: {
					favoriteWines: {
						name,
						_id,
						country,
						description,
						grapes,
						year
					}
				}
			},
			{ new: true }
		);

		res.status(StatusCode.OK).send(authenticatedUser?.favoriteWines);
	} catch (error) {
		if (error.message.includes('null')) {
			res.status(StatusCode.NOTFOUND).send({
				message: `Sorry from the sober API but you maybe took to many glasses of
				 ${req.params.wineId} is not a valid Id`
			});
		} else if (error.message.includes('Cast')) {
			res.status(StatusCode.BAD_REQUEST).send({
				message: 'Sorry but you need a ID to add a wine to your list'
			});
		} else if (!req.params) {
			res.status(StatusCode.METHOD_NOT_ALLOWED).send({
				message: `Sorry but thats not a valid ID:  ${req.params} `
			});
		} else {
			res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
				message: error.message
			});
		}
	}
};

export default {
	patch: {
		handler: patch,
		paramsPattern: '/:wineId',
		middleware: PasswordUtils.authVerifyByCookie
	}
};
