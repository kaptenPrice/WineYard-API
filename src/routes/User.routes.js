import UserController from '../controller/User.controller.js';
import WineController from '../controller/Wine.controller.js';
import AUTH0 from 'express-openid-connect';

const { requiresAuth } = AUTH0;

const routes = (app) => {
  //ADMIN ROUTS - WINELIST
  app.get('/', UserController.createUserIfEmailIsVerified);
  app.post('/wine', WineController.addWine);
  app.get('/getwines', WineController.getAllWines);
  app.get('/wines/:wineId', WineController.getWineById);
  app.get('/wine/:name', WineController.getWineByName);
  app.get('/winesbycountry/:country', WineController.getWineByCountry);

  app.patch('/wine/:wineId', WineController.updateWine);

  app.delete('/delete/:wineId', requiresAuth(), WineController.deleteWineById);

  //USER ROUTS
  app.get('/user/addfavoritewine/:wineId', UserController.addMyFavoriteWine);

  //ADMIN ROUTS - USER
  app.post('/createuser', UserController.createUser);
  app.get('/getall', requiresAuth(), UserController.getAllUSers);
  app.get('/getuserbyid/:userId', requiresAuth(), UserController.getUserById);
  //app.get('/search', requiresAuth(), UserController.getUserByUserNameQuery);
  app.get(
    '/M/:username',
    UserController.getUserByUserNameQueryWithoutAuth,
    UserController.getUserByUserNameQuery
  );
  app.put('/user/:userId', requiresAuth(), UserController.updateUser);
  app.delete('/delete/:userId', requiresAuth(), UserController.deleteUserById);
};

export default {
  routes,
};
