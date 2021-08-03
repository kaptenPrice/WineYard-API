import StatusCode from '../../config/StatusCode';
import { IHandlerProps } from '../../server';
import PasswordUtils from '../lib/PasswordUtils';
import UserModel from '../model/User.model';
import WineModel from '../model/Wine.model';

//TODO:check this
/**
 *
 * @param {Id from sub(jwt sub)} req
 * @param {*username and favoritewines-array} res
 */
const get: IHandlerProps = async (req, res) => {
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
