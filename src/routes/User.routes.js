import UserCtrl from '../controller/User.controller.js';
import WineCtrl from '../controller/Wine.controller.js';
import passport from 'passport';

// import AUTH0 from 'express-openid-connect';

// const { requiresAuth: reqAuth } = AUTH0;

const routes = (app) => {
  //Register Page
  app.get('/register', UserCtrl.getRegisterForm);
  app.get('/login', UserCtrl.getLoginForm);
  app.post('/register', UserCtrl.handleRegister);
  app.post(
    '/login',
    passport.authenticate('local', {
      failureRedirect: '/loginfailure',
      successRedirect: '/loginsucces',
    })
  );
  app.get("/loginfailure", (_, res, next)=>{
    res.send("You entered wrong password")
  })
  app.get("/loginsucces", (_, res, next)=>{
    res.send("Welcome you made it")
  })
  /** GET show this.user profile */
  // app.get('/', /* reqAuth()*/ UserCtrl.showProfile);

  // app.get('/', UserCtrl.createUserIfEmailIsNotVerified, UserCtrl.showProfile);

  /** DELETE requires wineId, removes this.wine from collection.wines*/
  app.delete('/delete/:wineId', WineCtrl.deleteWineById);
  /**
   *
   *
   *
   *
   *
   */

  /** POST requires input from body : name, country, description, grapes, year */
  app.post('/wine', WineCtrl.addWine);

  /** PATCH requires wineId, uppdates parameters in this.wine */
  app.patch('/wine/:wineId', WineCtrl.updateWine);

  /** GET get all wines in Winelist-API -> Collection Wines  */
  app.get('/getwines', WineCtrl.getAllWines);

  /**GET requires wineId in params, shows wine from collection.wine */
  app.get('/wines/:wineId', WineCtrl.getWineById);

  /**GET requires name(wine) in params, shows wine from collection.wine*/
  app.get('/wine/:name', WineCtrl.getWineByName);

  /**GET requires country in params, shows wine from collection.wine */
  app.get('/winesbycountry/:country', WineCtrl.getWineByCountry);

  /**PATCH requires wineId,  Adds this.wine to this.user favoritwines */
  app.patch(
    '/addfavoritewine/:wineId',

    UserCtrl.addFavoriteWine
  );

  /**PUT requires wineId, removes this.wine from this.user favoritwines */
  app.put(
    '/deletewine/:wineId',

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
  // app.get('/getall',   UserCtrl.getAllUSers);
  // app.get('/getuserbyid/:userId',   UserCtrl.getUserById);
  // app.put('/user/:userId',   UserCtrl.updateUser);
  // app.delete('/delete/:userId',   UserCtrl.deleteUserById);
};

export default {
  routes,
};
