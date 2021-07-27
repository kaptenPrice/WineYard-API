import UserCtrl from '../controller/User.controller';
import WineCtrl from '../controller/Wine.controller';
import path from 'path';
import passwordUtils from '../lib/PasswordUtils';
import {Request, Response} from 'express';

const availableRoutes = [
	'/register ',
	'/login ',
	'/profile ',
	'/logout ',
	'/wine/add ',
	'/wine/update ',
	'/wine/getall',
	'/wine/getbyid ',
	'/wine/getbyname ',
	'/wine/bycountry ',
	'/wine/delete ',
	'/user/addfavoritewine ',
	'/user/deletewine ',
	'/user/getall',
	'/user/getbyid '
];
const routes = (app: any) => {
	//sending layout to login and register
	app.get('/register', (req:Request, res:Response) => {
		if (!req.cookies?.token) {
			console.log(__dirname)
			res.sendFile(path.join(__dirname, '../../register.html'));

		} else {
			res.redirect('/profile');
		}
	});
	app.get('/login', (req:Request, res:Response) => {
		if (!req.cookies.token) {
			res.sendFile(path.join(__dirname, '../../login.html'));
		} else {
			res.redirect('/profile');
		}
	});
	app.get('/', (req:Request, res:Response) => {
		res.send({
			message: 'Wine Api',
			Goto: '/login',
			links: `${Object.values(availableRoutes)}`
		});
	});
	app.post('/register', UserCtrl.handleRegister);

	app.post('/login', UserCtrl.handleLogin, (req:Request, res:Response) => {
		res.send({ success: true, message: 'welcome', Goto: '/profile' });
	});
	/** GET show this.user profile */
	app.get('/profile', passwordUtils.authVerifyByCookie, UserCtrl.showProfile);

	app.get('/logout', UserCtrl.logout);

	app.get('/user/forgotpassword',UserCtrl.handleForgottPassword );
	app.get('/user/reset/:resetPasswordToken', UserCtrl.handleResetPassword);


	/** POST requires input from body : name, country, description, grapes, year */
	app.post('/wine/add', passwordUtils.authVerifyByCookie, WineCtrl.addWine);

	/** PATCH requires wineId, uppdates parameters in this.wine */
	app.patch('/wine/update/:wineId', passwordUtils.authVerifyByCookie, WineCtrl.updateWine);

	/** GET get all wines in Winelist-API -> Collection Wines  */
	app.get('/wine/getall', passwordUtils.authVerifyByCookie, WineCtrl.getAllWines);

	/**GET requires wineId in params, shows wine from collection.wine */
	app.get('/wine/getbyid/:wineId', passwordUtils.authVerifyByCookie, WineCtrl.getWineById);

	/**GET requires name(wine) in params, shows wine from collection.wine*/
	app.get('/wine/getbyname/:name', passwordUtils.authVerifyByCookie, WineCtrl.getWineByName);

	/**GET requires country in params, shows wine from collection.wine */
	app.get(
		'/wine/bycountry/:country', 
		passwordUtils.authVerifyByCookie,
		WineCtrl.getWineByCountry
	);
	/** DELETE requires wineId, removes this.wine from collection.wines*/
	app.delete('/wine/delete/:wineId', passwordUtils.authVerifyByCookie, WineCtrl.deleteWineById);

	/**PATCH requires wineId,  Adds this.wine to this.user favoritwines */
	app.patch(
		'/user/addfavoritewine/:wineId',
		passwordUtils.authVerifyByCookie,
		UserCtrl.addFavoriteWine
	);

	/**PUT requires wineId, removes this.wine from this.user favoritwines */
	app.put(
		'/user/deletewine/:wineId',
		passwordUtils.authVerifyByCookie,
		UserCtrl.deleteWineFromUsersList
	);

	/**
	 */
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
	routes
};
