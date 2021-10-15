import WineCtrl from '../controller/Wine.controller';
import passwordUtils from '../lib/PasswordUtils';
import { upload } from '../middleware/MiddleWares';

const wineRoutes = (app: any) => {
	/** POST requires input from body : name, country, description, grapes, year */
	app.post(
		'/wine/add',
		passwordUtils.authVerifyByCookie,
		upload.single('avatar'),
		WineCtrl.addWine
	);

	/** PATCH requires wineId, uppdates parameters in this.wine */
	app.patch('/wine/update/:wineId', passwordUtils.authVerifyByCookie, WineCtrl.updateWine);

	/** GET get all wines in Winelist-API -> Collection Wines  */
	app.get('/wine/getall', passwordUtils.authVerifyByCookie, WineCtrl.getAllWines);

	app.post('/wine/paginate', passwordUtils.authVerifyByCookie, WineCtrl.getWinesPaginated);

	/**GET requires wineId in params, shows wine from collection.wine */
	app.get('/wine/getbyid/:wineId', passwordUtils.authVerifyByCookie, WineCtrl.getWineById);

	app.get(
		'/wine/getaddedby',
		passwordUtils.authVerifyByCookie,
		WineCtrl.getWineAddedByCurrentUser
	);

	/**GET requires name(wine) in params, shows wine from collection.wine*/
	app.post(
		'/wine/byNameOrCountry',
		passwordUtils.authVerifyByCookie,
		WineCtrl.getWineByNameOrCountry
	);

	/** DELETE requires wineId, removes this.wine from collection.wines*/
	app.delete('/wine/delete/:wineId', passwordUtils.authVerifyByCookie, WineCtrl.deleteWineById);
};
export default { wineRoutes };
