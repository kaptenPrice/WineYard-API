import UserCtrl from '../controller/User.controller.js';
import WineCtrl from '../controller/Wine.controller.js';
import AUTH0 from 'express-openid-connect';
import UserController from '../controller/User.controller.js';

const { requiresAuth: reqAuth } = AUTH0;

const routes = (app) => {
  /** GET show this.user profile */
  app.get('/profile', reqAuth(), UserCtrl.showProfile);

  app.get('/', UserCtrl.createUserIfEmailIsNotVerified, UserCtrl.showProfile);

  /** DELETE requires wineId, removes this.wine from collection.wines*/
  app.delete('/delete/:wineId', reqAuth(), WineCtrl.deleteWineById);
  /**
   *
   *
   */

  /** POST requires input from body : name, country, description, grapes, year */
  app.post('/addwine', reqAuth(), WineCtrl.addWine);

  /** PATCH requires wineId, uppdates parameters in this.wine */
  app.patch('/wine/:wineId', reqAuth(), WineCtrl.updateWine);

  /** GET get all wines in Winelist-API -> Collection Wines  */
  app.get('/getwines', reqAuth(), WineCtrl.getAllWines);

  /**GET requires wineId in params, shows wine from collection.wine */
  app.get('/winebyid/:wineId', reqAuth(), WineCtrl.getWineById);

  /**GET requires name(wine) in params, shows wine from collection.wine*/
  app.get('/winebyname/:name', reqAuth(), WineCtrl.getWineByName);

  /**GET requires country in params, shows wine from collection.wine */
  app.get('/winesbycountry/:country', reqAuth(), WineCtrl.getWineByCountry);

  /**PATCH requires wineId,  Adds this.wine to this.user favoritwines */
  app.patch(
    '/addfavoritewine/:wineId',
    reqAuth(),
    UserCtrl.addFavoriteWine
  );

  /**PUT requires wineId, removes this.wine from this.user favoritwines */
  app.put(
    '/deletefavoritewine/:wineId',
    reqAuth(),
    UserCtrl.deleteWineFromUsersList
  );

  /**
   *
   *
   *
   *
   *
   *
   *
   *
   *
   */
  //ADMIN ROUTS - USER
  // app.post('/createuser', UserCtrl.createUser);
   app.get('/getall', reqAuth(), UserCtrl.getAllUSers);
  // app.get('/getuserbyid/:userId', reqAuth(), UserCtrl.getUserById);
  // app.put('/user/:userId', reqAuth(), UserCtrl.updateUser);
  // app.delete('/delete/:userId', reqAuth(), UserCtrl.deleteUserById);
};

export default {
  routes,
};
