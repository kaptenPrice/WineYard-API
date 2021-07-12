import UserController from '../controller/User.controller.js';

const routes = (app) => {
  app.post('/createuser', UserController.createUser);
  app.get('/getall', UserController.getAllUSers);
  app.get('/getuserbyid/:userId', UserController.getUserById);
  app.get('/search', UserController.getUserByUserNameQuery);
  app.put('/user/:userId', UserController.updateUser);
  app.delete('/delete/:userId', UserController.deleteUserById);
};

export default {
  routes,
};
