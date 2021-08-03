import { HandlerType } from 'express-static-router';

const availableRoutes = [
	'/register',
	'/login',
	'/profile',
	'/logout',
	'/user/forgotpassword',
	'/user/addfavoritewine',
	'/user/deletewine',
	'/user/getall',
	'/user/getbyid',
	'/wine/add',
	'/wine/update',
	'/wine/getall',
	'/wine/getbyid',
	'/wine/getbyname',
	'/wine/bycountry',
	'/wine/delete'
];

export const get: HandlerType = (req, res) => {
	res.send({
		message: 'Wine Api',
		Goto: '/login',
		links: availableRoutes
	});
};
