import WineCtrl from '../controller/Wine.controller';
import passwordUtils from '../lib/PasswordUtils';


const wineRoutes = (app: any) => {
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
};
export default { wineRoutes };
