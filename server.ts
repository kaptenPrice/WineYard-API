import express, {  Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import middleWares from './src/middleware/MiddleWares';
import DBConfiguration from './config/DBConfiguration';
import UserRoutes from './src/routes/User.routes';
import StatusCode from './config/StatusCode';
import crypto from 'crypto';
import UserModel from './src/model/User.model';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import PasswordUtils from './src/lib/PasswordUtils';

export type IHandlerProps = (
	req: Request,
	res: Response,
) => Promise<any | undefined>;

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

app.use(
	morgan('common', {
		stream: fs.createWriteStream(path.join(__dirname, 'access.log'), {
			flags: 'a'
		})
	})
);

DBConfiguration.connectToDB();
DBConfiguration.connectToPort(app);

// app.get('/user/forgotpassword', async (req, res) => {
// 	if (req.body.email === '') {
// 		res.status(StatusCode.BAD_REQUEST).send('email required');
// 	} else {
// 		try {
// 			const randomByte = crypto.randomBytes(12).toString('hex');
// 			const tempToken = mongoose.Types.ObjectId(randomByte);
// 			const expiresIn = 3600000;
// 			const currentUser = await UserModel.findOneAndUpdate(
// 				req.body.email,
// 				{
// 					resetPasswordToken: tempToken,
// 					resetPasswordExpires: Date.now() + expiresIn
// 				},
// 				{ new: true }
// 			);

// 			const transporter = nodemailer.createTransport({
// 				service: 'gmail',
// 				auth: {
// 					user: `winelistapi@gmail.com`,
// 					pass: `Krabba30`
// 				}
// 			});
// 			const mailOptions = {
// 				from: 'winelistapi@gmail.com',
// 				to: `${currentUser?.email}`,
// 				subject: 'Link to reset password',
// 				text:
// 					'Password reset email\n\n' +
// 					'Click here:\n\n' +
// 					`http://localhost:3001/reset/${tempToken}\n\n`
// 			};
// 			console.log('sending Email');
// 			transporter.sendMail(mailOptions, (err, response) => {
// 				if (err) {
// 					console.log('there was an error ', err.message);
// 					return res.status(StatusCode.BAD_REQUEST).send(err.message);
// 				} else {
// 					console.log('Here is res: ', response);
// 					res.status(StatusCode.OK).json(`recovery mail sent to ${currentUser?.email}`);
// 				}
// 			});
// 		} catch (error) {
// 			res.status(StatusCode.BAD_REQUEST).send({ message: `${req.body.email} dosnt exist` });
// 			console.log(error.message);
// 		}
// 	}
// });
// app.get('/user/reset/:resetPasswordToken', async (req, res) => {
// 	const resetPasswordToken = req.params.resetPasswordToken;
// 	const user = await UserModel.findOne({
// 		resetPasswordToken,
// 		resetPasswordExpires: {
// 			$gt: Date.now()
// 		}
// 	});
// 	if (user === null) {
// 		console.log('Password reset link is invalid or out of date');
// 		res.status(StatusCode.BAD_REQUEST).json('Password reset link is invalid or to old');
// 	} else {
// 		try {
// 			const { salt, hash } = PasswordUtils.passwordGenerator(req.body.password);
// 			await user.updateOne(
// 				{
// 					hash,
// 					salt,
// 					resetPasswordToken: null,
// 					resetPasswordExpires: null
// 				},
// 				{ new: true }
// 			);
// 			res.send();
// 		} catch (error) {
// 			console.log(error.message);
// 		}
// 	}
// });
UserRoutes.routes(app);

// app.use(middleWares.notFound);
app.use(middleWares.errorHandler);

export default app;

const x = <a>(output: a): a => {
	return output;
};

const y = x<string>('khazar');
