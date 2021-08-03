import { HandlerType } from 'express-static-router';
import StatusCode from '../../../config/StatusCode';
import UserModel from '../../model/User.model';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import mongoose from 'mongoose';

export const get: HandlerType = async (req, res) => {
	if (req.body.email === '') {
		res.status(StatusCode.BAD_REQUEST).send('email required');
	} else {
		try {
			const randomByte = crypto.randomBytes(12).toString('hex');
			const tempToken = mongoose.Types.ObjectId(randomByte);
			const expiresIn = 3600000;
			const currentUser = await UserModel.findOneAndUpdate(
				req.body.email,
				{
					resetPasswordToken: tempToken,
					resetPasswordExpires: Date.now() + expiresIn
				},
				{ new: true }
			);

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
					`http://localhost:3001/user/reset/${tempToken}\n\n`
			};
			console.log('sending Email');
			transporter.sendMail(mailOptions, (err, response) => {
				if (err) {
					console.log('there was an error ', err.message);
					return res.status(StatusCode.BAD_REQUEST).send(err.message);
				} else {
					console.log('Here is res: ', response);
					res.status(StatusCode.OK).json(`recovery mail sent to ${currentUser?.email}`);
				}
			});
		} catch (error) {
			res.status(StatusCode.BAD_REQUEST).send({ message: `${req.body.email} doesn't exist` });
			console.log(error.message);
		}
	}
};
