import { Response } from 'express';
import StatusCode from '../../../config/StatusCode';
import PasswordUtils, { RequestType } from '../../lib/PasswordUtils';
import UserModel from '../../model/User.model';

/**PUT requires wineId, removes this.wine from this.user favoritwines */
/**
 * @param {*Wine ID} req
 * @param {*Authenticateduser.favoriteWines} res
 */
const put = async (req: RequestType | any, res: Response) => {
	try {
		const authenticatedUser = await UserModel.findOneAndUpdate(
			req.jwt.sub,
			{
				$pull: {
					favoriteWines: {
						_id: req.params.wineId
					}
				}
			},
			{ new: true }
		);
		//TODO:check this
		authenticatedUser?.favoriteWines?.length !== 0
			? res.status(StatusCode.OK).send(authenticatedUser?.favoriteWines)
			: res.status(StatusCode.OK).send(authenticatedUser);
	} catch (error) {
		res.status(StatusCode.INTERNAL_SERVER_ERROR).send({ message: error.message });
	}
};

export default {
	put: {
		handler: put,
		paramsPattern: '/:wineId',
		middleware: PasswordUtils.authVerifyByCookie
	}
};
