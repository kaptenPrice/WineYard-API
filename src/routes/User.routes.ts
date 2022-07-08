import { Application } from 'express';
import {
	createUser,
	deleteUser,
	getUsers,
	getUserById,
	updateUser
} from '../controller/User.controller';

const userRoutes = (app: Application) => {
	app.get('/getusers', getUsers);
	app.get('/userbyid', getUserById);
	app.post('/user', createUser);
	app.delete('/user', deleteUser);
	app.put('/user', updateUser);
};

export default userRoutes;
