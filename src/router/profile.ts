import { Response } from 'express';
import StatusCode from '../../config/StatusCode';
import PasswordUtils, { RequestType } from '../lib/PasswordUtils';
import UserModel from '../model/User.model';
import WineModel from '../model/Wine.model';

const get = async (req: RequestType, res: Response) => {
	try {
		const profile = await UserModel.findOne({ _id: req.jwt.sub });
		const favoriteWines = await WineModel.find({
			_id: { $in: profile?.favoriteWines }
		});
		const email = profile?.email;
		favoriteWines.length !== 0
			? res.status(StatusCode.OK).send({ email, favoriteWines })
			: res.status(StatusCode.OK).send({ email, message: 'Empty list' });
	} catch (error) {
		res.status(StatusCode.NOTFOUND).send({ error: error.message });
	}
};

export default {
	get: { handler: get },
	middleware: PasswordUtils.authVerifyByCookie
};
