import UserController from '../controller/User.controller.js';
import AUTH0 from 'express-openid-connect';

const { requiresAuth } = AUTH0;

const routes = (app) => {
  app.get('/', requiresAuth(), UserController.homePage);
  app.post('/createuser', UserController.createUser);
  app.get('/getall', requiresAuth(), UserController.getAllUSers);
  app.get('/getuserbyid/:userId', requiresAuth(), UserController.getUserById);
  //app.get('/search', requiresAuth(), UserController.getUserByUserNameQuery);
  app.get('/M/:username',  UserController.getUserByUserNameQueryWithoutAuth, UserController.getUserByUserNameQuery);
  app.put('/user/:userId', requiresAuth(), UserController.updateUser);
  app.delete('/delete/:userId', requiresAuth(), UserController.deleteUserById);
};

export default {
  routes,
};
