import UserModel from '../model/User.model.js';
import StatusCode from '../../config/StatusCode.js';
import WineModel from '../model/Wine.model.js';
import PasswordUtils from '../lib/PasswordUtils.js';

/**
 * POST
 * @param {*password, email} req
 * @param {*redirect("/login")} res
 * @param {*null} next
 */
const handleRegister = async (req, res) => {
	const { salt, hash } = PasswordUtils.passwordGenerator(req.body.password);
	try {
		await new UserModel({
			email: req.body.email,
			hash,
			salt
		})
			.save()
			.then((user) => {
				res.status(StatusCode.OK).send({ message: 'Go to /login' });
			});
	} catch (err) {
		console.log(err.message);
		res.json({ success: false, msg: err });
	}
};
/**
 * POST
 * @param {*password, email} req
 * @param {*redirect("/login")} res
 * @param {*null} next
 */
const handleLogin = async (req, res, next) => {
	const { email, password } = await req.body;
	if (req.cookies.token) {
		res.redirect('/');
	} else {
		if (email && password) {
			try {
				const user = await UserModel.findOne({ email });
				if (!user) {
					res.status(StatusCode.UNAUTHORIZED).send({
						message: `Couldnt find user ${email},  go to /register`
					});
					return;
				}
				const isValid = PasswordUtils.passwordValidator(password, user.hash, user.salt);
				if (isValid) {
					PasswordUtils.generateJwt(user, res);
					res.status(StatusCode.OK);
					next();
				} else {
					res.status(StatusCode.UNAUTHORIZED).send({
						message: 'You entered wrong password'
					});
				}
			} catch (error) {
				res.status(StatusCode.BAD_REQUEST).send({
					message: 'Error in UserController.login',
					error: error.message
				});
			}
		} else {
			res.send({ message: 'Username and password is required, go to /login' });
		}
	}
};
/**
 * GET
 * @param {*} req
 * @param {*redirect("/login")} res
 */
const logout = async (req, res) => {
	try {
		await res.clearCookie('token');
		res.redirect('/login');
	} catch (error) {
		res.send({ error: error.message, message: ' Couldnt log out user' });
	}
};
/**
 *
 * @param {Id from sub(jwt sub)} req
 * @param {*username  and favoritewines-array} res
 */
const showProfile = async (req, res) => {
	try {
		const profile = await UserModel.findOne({ _id: req.jwt.sub });
		const favoriteWines = await WineModel.find({
			_id: { $in: profile.favoriteWines }
		});
		const { email } = profile;
		favoriteWines.length !== 0
			? res.status(StatusCode.OK).send({ email, favoriteWines })
			: res.status(StatusCode.OK).send({ email, message: 'Empty list' });
	} catch (error) {
		res.status(StatusCode.NOTFOUND).send({ error: error.message });
	}
};
/**
 *User functions
 * @param {*Wine ID} req
 * @param {*Authenticateduser.favoriteWines} res
 */
const addFavoriteWine = async (req, res) => {
	try {
		const favoriteWine = await WineModel.findById(req.params.wineId);

		const { name, _id, country, description, grapes, year } = favoriteWine;

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

		res.status(StatusCode.OK).send(authenticatedUser.favoriteWines);
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
const deleteWineFromUsersList = async (req, res) => {
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
		authenticatedUser.favoriteWines.length !== 0
			? res.status(StatusCode.OK).send(authenticatedUser.favoriteWines)
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
const getAllUSers = async (req, res) => {
	try {
		const response = await UserModel.find();
		res.status(StatusCode.OK).send(response);
	} catch (error) {
		res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
			message: error.message
		});
	}
};

const getUserById = async (req, res) => {
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

const getUserByUserNameQuery = async (req, res) => {
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
			message: 'Error occured while trying to retrieve user with username:' + req.params.userName
		});
	}
};

const deleteUserById = async (req, res) => {
	try {
		const response = await UserModel.findByIdAndDelete(req.params.userId);
		res.status(StatusCode.OK).send({
			message: `Successfully deleted: ${response.username} and ID ${response._id}`
		});
	} catch (error) {
		res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
			message: 'Error occured while trying to find and delete user with ID:' + req.params.userId
		});
	}
};

/****************************************************/

export default {
	showProfile,
	handleRegister,
	handleLogin,
	logout,
	getAllUSers,
	getUserById,
	getUserByUserNameQuery,
	deleteUserById,
	addFavoriteWine,
	deleteWineFromUsersList
};
