import UserCtrl from '../controller/User.controller';
import path from 'path';
import passwordUtils from '../lib/PasswordUtils';
import { Request, Response } from 'express';

const availableRoutes = [
	'/register',
	'/login',
	'/profile',
	'/logout',
	'/wine/add',
	'/wine/update',
	'/wine/getall',
	'/wine/getbyid',
	'/wine/getbyname',
	'/wine/bycountry',
	'/wine/delete',
	'/user/addfavoritewine',
	'/user/deletewine',
	'/user/forgotpassword',
	'/user/getall',
	'/user/getbyid'
];
const userRoutes = (app: any) => {
	//sending layout to login and register
	app.get('/register', (req: Request, res: Response) => {
		if (!req.cookies?.token) {
			console.log(__dirname);
			res.sendFile(path.join(__dirname, '../../register.html'));
		} else {
			res.redirect('/profile');
		}
	});
	app.get('/login', (req: Request, res: Response) => {
		if (!req.cookies.token) {
			res.sendFile(path.join(__dirname, '../../login.html'));
		} else {
			res.redirect('/profile');
		}
	});
	app.get('/', (req: Request, res: Response) => {
		res.send({
			message: 'Wine Api',
			Goto: '/login',
			links: `${Object.values(availableRoutes)}`
		});
	});
	app.post('/register', UserCtrl.handleRegister);
	
	app.post('/login', UserCtrl.handleLogin);
	/** GET show this.user profile */
	app.get('/profile', passwordUtils.authVerifyByCookie, UserCtrl.showProfile);

	app.get('/logout', UserCtrl.logout);

	app.post('/user/forgotpassword', UserCtrl.handleForgottPassword);

	app.post('/user/resetPassword/:temporaryToken', UserCtrl.handleResetPassword);

	/**PATCH requires wineId,  Adds this.wine to this.user favoritwines */
	app.patch(
		'/user/addfavoritewine',
		passwordUtils.authVerifyByCookie,
		UserCtrl.addFavoriteWine
	);
	/**PUT requires wineId, removes this.wine from this.user favoritwines */
	app.put(
		'/user/deletewine/:wineId',
		passwordUtils.authVerifyByCookie,
		UserCtrl.deleteWineFromUsersList
	);
	//ADMIN ROUTS - USER
	app.get('/user/getall', passwordUtils.authVerifyByCookie, UserCtrl.getAllUSers);
	app.get('/user/getbyid/:userId', passwordUtils.authVerifyByCookie, UserCtrl.getUserById);
	app.get(
		'/user/getbyname/:username',
		passwordUtils.authVerifyByCookie,
		UserCtrl.getUserByUserNameQuery
	);
	app.delete('/user/delete/:userId', passwordUtils.authVerifyByCookie, UserCtrl.deleteUserById);
};

export default {
	userRoutes
};
