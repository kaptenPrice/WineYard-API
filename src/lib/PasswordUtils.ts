import crypto, { BinaryLike } from 'crypto';
import jsonWebToken, { Secret } from 'jsonwebtoken';
import StatusCode from '../../config/StatusCode';
import dotenv from 'dotenv';
import { IUser } from '../model/User.model';
import { Response, Request, NextFunction } from 'express';
dotenv.config();

const PRIV_KEY: Secret = process.env.PRIVATE_KEY as Secret;
const PUB_KEY: Secret = process.env.PUBLIC_KEY as Secret;

/**
 *Creating salt and hash from password and storing these in db.
 * @param {password from register}
 * @returns
 */
const passwordGenerator = (password: BinaryLike) => {
	const salt = crypto.randomBytes(32).toString('hex');
	const generatedHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
	return {
		salt: salt,
		hash: generatedHash
	};
};
/**Decrypting the hash by salt and compares the resykt with login password
 *@param {password }
 *@param {hash stored in the DB}
 *@param {salt stored in the DB}
 */

const passwordValidator = (password: BinaryLike, hash: BinaryLike, salt: BinaryLike) => {
	const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
	return hash === hashVerify;
};

/**

 * @param {*user - the user object }
 * @returns the jwt-token including the users ID as sub in token
 */
const generateJwt = async (user: IUser, res: Response) => {
	const _id = user._id;
	const expiresIn = '1d';
	const expiration = process.env.ENVIROMENT === 'DEVELOPMENT' ? 3600000 : 604800000;
	const payload = {
		sub: _id,
		iat: Math.floor(Date.now() / 1000)
	};
	const signedToken = jsonWebToken.sign(payload, PRIV_KEY, {
		expiresIn: expiresIn,
		algorithm: 'RS256'
	});
	await res.cookie('token', signedToken, {
		expires: new Date(Date.now() + expiration)
		//secure: false, //TODO Set to true in production
		//httpOnly: true
	});

	/**
	 * (If frontend) then return the token and let the frontend handle cookie
	 */
	// return {
	//   token: 'Bearer ' + signedToken,
	//   expiresIn: expiresIn,
	// }
};

/**
 * @param {*} req pick the token from header
 */
const authVerifyByToken = async (req: Request | any, res: Response, next: NextFunction) => {
	const tokenParts = await req.headers.authorization?.split(' ');
	if (tokenParts && tokenParts[0] === 'Bearer' && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null) {
		try {
			const payload = jsonWebToken.verify(tokenParts[1], PUB_KEY, {
				algorithms: ['RS256']
			});
			req.jwt = payload;
			next();
		} catch (error) {
			res.status(StatusCode.UNAUTHORIZED).send({
				message: 'You lack authority to access this endpoint,  log in please',
				error: error.message
			});
		}
	} else {
		res.status(StatusCode.UNAUTHORIZED).send({
			message: 'You lack authority to access this endpoint, log in please '
		});
	}
};

/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const authVerifyByCookie = async (req: Request | any, res: Response, next: NextFunction) => {
	let token = req.cookies.token;

	if (token?.match(/\S+\.\S+\.\S+/) !== null) {
		try {
			const payload = jsonWebToken.verify(token, PUB_KEY, { algorithms: ['RS256'] });
			req.jwt = payload;
			next();
		} catch (error) {
			res.status(StatusCode.UNAUTHORIZED).send({
				message: 'Sesssion has expired ,log in again please /login',
				error: error.message
			});
		}
	} else {
		res.status(StatusCode.UNAUTHORIZED).send({
			message: 'You lack authority to access this endpoint, please log in again '
		});
	}
};

export default {
	passwordValidator,
	passwordGenerator,
	generateJwt,
	authVerifyByToken,
	authVerifyByCookie
};
