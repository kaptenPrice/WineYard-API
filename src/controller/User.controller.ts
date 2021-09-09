import UserModel from '../model/User.model';
import StatusCode from '../../config/StatusCode';
import WineModel, { IWine } from '../model/Wine.model';
import PasswordUtils, { RequestType } from '../lib/PasswordUtils';
import { IHandlerProps } from '../../server';
import { NextFunction, Response } from 'express';
import crypto from 'crypto';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

import { errorParser } from '../lib/helper';

dotenv.config();

/**
 * POST
 * @param {*password, email} req
 * @param {*redirect("/login")} res
 * @param {*null} next
 */
const handleRegister: IHandlerProps = async (req, res) => {
	const { email, password } = await req.body;

	if (email && password) {
		const { salt, hash } = PasswordUtils.passwordGenerator(password);
		try {
			await new UserModel({
				email,
				hash,
				salt
			})
				.save()
				.then((user) => {
					res.status(StatusCode.OK).send({ message: req.t('user_register_success') });
				});
		} catch (err) {
			console.log(err.message);
			res.status(StatusCode.BAD_REQUEST).json({
				message: err?.errors ? errorParser(err.errors)?.email : err.message
			});
		}
	} else {
		!password
			? res.status(StatusCode.FORBIDDEN).json({ message: req.t('user_password_error') })
			: res.status(StatusCode.FORBIDDEN).json({ message: req.t('user_email_error') });
	}
};
/**
 * POST
 * @param {*password, email} req
 * @param {*redirect("/login")} res
 * @param {*null} next
 */
const handleLogin = async (req: any, res: Response, next: NextFunction) => {
	const { email, password } = await req.body;
	if (req.cookies.token) {
		res.redirect('/');
	} else {
		if (!email || !password) {
			res.status(StatusCode.UNAUTHORIZED).send({
				message: req.t('user_handleLogin_empty_reg')
			});
			return;
		} else {
			try {
				const user = await UserModel.findOne({ email });
				if (!user) {
					res.status(StatusCode.UNAUTHORIZED).send({
						message: req.t('user_notfound_DB')
					});
					return;
				}
				const isValid = PasswordUtils.passwordValidator(password, user.hash, user.salt);
				if (isValid) {
					PasswordUtils.generateJwt(user, res);
					res.send({ success: true, message: req.t('user_isValid') });
				} else {
					res.status(StatusCode.UNAUTHORIZED).send({
						message: req.t('user_credentials_error')
					});
				}
			} catch (error) {
				res.status(StatusCode.BAD_REQUEST).send({
					message: req.t(),
					error: error.message
				});
			}
		}
	}
};
/**
 * GET
 * @param {*} req
 * @param {*redirect("/login")} res
 */
const logout = (req: any, res: Response) => {
	try {
		res.clearCookie('token');
		res.send({ message: req.t('user_logout_success') });
	} catch (error) {
		res.send({ error: error.message, message: req.t('user_logout_error') });
	}
};

const handleForgottPassword: IHandlerProps = async (req, res) => {
	const { email } = req.body;
	if (email === '') {
		res.status(StatusCode.BAD_REQUEST).send({ message: 'Email is required' });
		return;
	} else {
		try {
			const randomByte = crypto.randomBytes(12).toString('hex');
			const temporaryToken = mongoose.Types.ObjectId(randomByte);
			const expiresIn = 3600000;
			const currentUser = await UserModel.findOneAndUpdate(
				{ email },
				{
					resetPasswordToken: temporaryToken,
					resetPasswordExpires: Date.now() + expiresIn
				},
				{ new: true }
			);
			console.log('CurrentUSer: ', currentUser);

			const transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: process.env.EMAIL,
					pass: process.env.PASSWORD
				}
			});
			const mailOptions = {
				from: process.env.EMAIL,
				to: `${currentUser?.email}`,
				subject: 'Link to reset password',
				text:
					'Password reset email\n\n' +
					'Click here:\n\n' +
					`http://localhost:3000/resetpassword/${temporaryToken}`
			};
			transporter.sendMail(mailOptions, (err, response) => {
				if (err) {
					console.log('there was an error ', err.message);
					return res.status(StatusCode.BAD_REQUEST).send({ message: err.message });
				} else {
					res.status(StatusCode.OK).json({
						message: `Please check your mailbox`,
						response
					});
				}
			});
		} catch (error) {
			res.status(StatusCode.BAD_REQUEST).send({
				message: `Email is not registered`,
				error: error.message
			});
			console.log(error.message);
		}
	}
};
const handleResetPassword: IHandlerProps = async (req, res) => {
	const resetPasswordToken = req.params.temporaryToken;
	const user = await UserModel.findOne({
		resetPasswordToken,
		resetPasswordExpires: {
			$gt: Date.now()
		}
	});

	if (user === null) {
		console.log('Password reset link is invalid or out of date');
		res.status(StatusCode.BAD_REQUEST).send({
			message: 'Password reset link is invalid or to old'
		});
		return;
	} else {
		if (!req.body.password) {
			res.status(200).end();
			return;
		}
		try {
			const { salt, hash } = PasswordUtils.passwordGenerator(req.body.password);
			await user.updateOne(
				{
					hash,
					salt,
					resetPasswordToken: null,
					resetPasswordExpires: null
				},
				{ new: true }
			);
			res.send({ message: 'Log in with your new password' });
		} catch (error) {
			res.status(StatusCode.BAD_REQUEST).send({ message: error.message });
		}
	}
};

/**
 *
 * @param req Id from sub(jwt sub)
 * @param res username and favoritewines-array
 */
const showProfile = async (req: RequestType, res: Response) => {
	try {
		const profile = await UserModel.findOne({ _id: req.jwt.sub });
		const email = profile.email;
		const favoriteWines = await WineModel.find({
			_id: { $in: profile?.favoriteWines }
		});
		res.status(StatusCode.OK).send({ profile: { email, favoriteWines } });
	} catch (error) {
		console.log('Profiel err: ', error.message);
		res.status(StatusCode.UNAUTHORIZED).send({ error: error.message });
	}
};
/**
 *User functions
 * @param {*Wine ID} req
 * @param {*Authenticateduser.favoriteWines} res
 */

const addFavoriteWine = async (req: RequestType, res: Response) => {
	try {
		const favoriteWine = await WineModel.findByIdAndUpdate(
			req.body.id,
			{
				$addToSet: {
					likedBy: req.jwt.sub
				}
			},
			{ new: true }
		);
		console.log(favoriteWine);
		const authenticatedUser = await UserModel.findByIdAndUpdate(
			req.jwt.sub,
			{
				$addToSet: {
					favoriteWines: favoriteWine
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
/**
 * @param {*Wine ID} req
 * @param {*Authenticateduser.favoriteWines} res
 */
const deleteWineFromUsersList = async (req: RequestType | any, res: Response) => {
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
		authenticatedUser?.favoriteWines?.length !== 0
			? res.status(StatusCode.OK).send(authenticatedUser?.favoriteWines)
			: res.status(StatusCode.OK).send(authenticatedUser);
	} catch (error) {
		res.status(StatusCode.INTERNAL_SERVER_ERROR).send({ message: error.message });
	}
};
/*
 *
 * Admin functions
 *
 */
const getAllUSers: IHandlerProps = async (req, res) => {
	try {
		const response = await UserModel.find();
		res.status(StatusCode.OK).send(response);
	} catch (error) {
		res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
			message: error.message
		});
	}
};

const getUserById: IHandlerProps = async (req, res) => {
	try {
		const response = await UserModel.findById(req.params.userId);
		res.status(StatusCode.OK).send(response);
	} catch (error) {
		res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
			error: error.message,
			message: 'Error occured while trying to retrieve user with ID:' + req.params.userId
		});
	}
};

const getUserByUserNameQuery: IHandlerProps = async (req, res) => {
	try {
		const response = await UserModel.find({
			username: req.params.username
		});
		response.length !== 0
			? res.status(StatusCode.OK).send(response)
			: res.status(StatusCode.NOTFOUND).send({
					message: 'Couldnt find user ' + req.params.username
			  });
	} catch (error) {
		res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
			error: error.message,
			message:
				'Error occured while trying to retrieve user with username:' + req.params.userName
		});
	}
};

const deleteUserById: IHandlerProps = async (req, res) => {
	try {
		const response = await UserModel.findByIdAndDelete(req.params.userId);
		res.status(StatusCode.OK).send({
			message: `Successfully deleted: and ID ${response?._id}`
		});
	} catch (error) {
		res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
			message:
				'Error occured while trying to find and delete user with ID:' + req.params.userId
		});
	}
};

/****************************************************/

export default {
	showProfile,
	handleRegister,
	handleLogin,
	logout,
	handleForgottPassword,
	handleResetPassword,
	getAllUSers,
	getUserById,
	getUserByUserNameQuery,
	deleteUserById,
	addFavoriteWine,
	deleteWineFromUsersList
};
