import WineModel from '../model/Wine.model';
import StatusCode from '../../config/StatusCode';
import { objectFilter } from '../middleware/MiddleWares';
import { IHandlerProps, io } from '../../server';
import { RequestType } from '../lib/PasswordUtils';
import { Response } from 'express';
import UserModel from '../model/User.model';

const addWine = async (req: RequestType, res: Response) => {
	const userId = req?.jwt?.sub;
	const { email } = await UserModel.findById(userId);

	const avatar = req.file?.path;
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
			year,
			avatar,
			addedByUser: email
		}).save();
		io.emit('wine-added', response);
		console.log('response : ', response);

		res.status(StatusCode.CREATED).send(response);
	} catch (error) {
		res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
			message: `${name} already exists`,
			error: error.message.startsWith('E11000') ? 'duplicated name' : error.message
		});
	}
};

const getAllWines: IHandlerProps = async (req, res) => {
	try {
		const response = await WineModel.find();
		res.status(StatusCode.OK).send(response);
	} catch (error) {
		res.status(StatusCode.INTERNAL_SERVER_ERROR).send({ message: error.message });
	}
};
/**
 *
 * @param req page and size
 * @param res repsonse from db
 */
const getWinesPaginated: IHandlerProps = async (req, res) => {
	let { page, size } = req.body;
	try {
		if (typeof page !== 'number' || page <= 0) {
			page = 1;
		}
		if (!size) {
			size = 10;
		}
		const limit = parseInt(size);
		const skip = (page - 1) * size;
		const amountWines = await WineModel.countDocuments();
		const response = await WineModel.find().limit(limit).skip(skip);
		res.send({
			data: response,
			page,
			size,
			amountWines
		});
	} catch (error) {
		res.status(StatusCode.INTERNAL_SERVER_ERROR).send({ message: error.message });
	}
};
const getWineById: IHandlerProps = async (req, res) => {
	try {
		const response = await WineModel.findById(req.params.wineId);
		res.status(StatusCode.OK).send(response);
	} catch (error) {
		res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
			error: error.message,
			message: 'Error occured while trying to retrieve user with ID:' + req.params.wineId
		});
	}
};

const getWineByNameOrCountry: IHandlerProps = async (req, res) => {
	const property = /* req.body.name ? 'name' : 'country'; */ Object.keys(req.body)[0];
	const value = req.body[property];
	const searchParams = { [property]: property === 'country' ? value.toUpperCase() : value };

	try {
		const response = await WineModel.find(searchParams);
		response.length !== 0
			? res.status(StatusCode.FOUND).send(response)
			: res.status(StatusCode.NOTFOUND).send({
					message: `Couldnt find wine ${value}`
			  });
	} catch (error) {
		res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
			error: error.message,
			message: `Error occured while trying to retrieve ${value}`
		});
	}
};

const updateWine: IHandlerProps = async (req, res) => {
	let { name, country, description, grapes, year } = req.body;
	try {
		if (!name && !country && !grapes && !year && !description) {
			return res
				.status(StatusCode.BAD_REQUEST)
				.send({ message: 'Cannot insert empty values' });
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
					'Error occured while trying to update values of the wine with ID:' +
					req.params.wineId,
				error: error.message
			});
	}
};

const deleteWineById: IHandlerProps = async (req, res) => {
	try {
		const response = await WineModel.findByIdAndDelete(req.params.wineId);
		res.status(StatusCode.OK).send({
			message: `Successfully deleted: ID ${response?._id}`
		});
	} catch (error) {
		res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
			message:
				'Error occured while trying to find and delete wine with ID:' + req.params.wineId,
			error: error.message
		});
	}
};

export default {
	getWineById,
	getAllWines,
	getWinesPaginated,
	addWine,
	updateWine,
	getWineByNameOrCountry,
	deleteWineById
};
