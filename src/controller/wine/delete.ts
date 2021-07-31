import StatusCode from '../../../config/StatusCode';
import { IHandlerProps } from '../../../server';
import PasswordUtils from '../../lib/PasswordUtils';
import WineModel from '../../model/Wine.model';

/** DELETE requires wineId, removes this.wine from collection.wines*/
const deleteWineById: IHandlerProps = async (req, res) => {
	try {
		const response = await WineModel.findByIdAndDelete(req.params.wineId);
		res.status(StatusCode.OK).send({
			message: `Successfully deleted: ID ${response?._id}`
		});
	} catch (error) {
		res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
			message:
				'Error occurred while trying to find and delete wine with ID:' + req.params.wineId,
			error: error.message
		});
	}
};

export default {
	delete: {
		handler: deleteWineById,
		paramsPattern: '/:wineId',
		middleware: PasswordUtils.authVerifyByCookie
	}
};
