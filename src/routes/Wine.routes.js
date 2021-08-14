"use strict";
exports.__esModule = true;
var Wine_controller_1 = require("../controller/Wine.controller");
var PasswordUtils_1 = require("../lib/PasswordUtils");
var wineRoutes = function (app) {
    /** POST requires input from body : name, country, description, grapes, year */
    app.post('/wine/add', PasswordUtils_1["default"].authVerifyByCookie, Wine_controller_1["default"].addWine);
    /** PATCH requires wineId, uppdates parameters in this.wine */
    app.patch('/wine/update/:wineId', PasswordUtils_1["default"].authVerifyByCookie, Wine_controller_1["default"].updateWine);
    /** GET get all wines in Winelist-API -> Collection Wines  */
    app.get('/wine/getall', PasswordUtils_1["default"].authVerifyByCookie, Wine_controller_1["default"].getAllWines);
    /**GET requires wineId in params, shows wine from collection.wine */
    app.get('/wine/getbyid/:wineId', PasswordUtils_1["default"].authVerifyByCookie, Wine_controller_1["default"].getWineById);
    /**GET requires name(wine) in params, shows wine from collection.wine*/
    app.get('/wine/getbyname/:name', PasswordUtils_1["default"].authVerifyByCookie, Wine_controller_1["default"].getWineByName);
    /**GET requires country in params, shows wine from collection.wine */
    app.get('/wine/bycountry/:country', PasswordUtils_1["default"].authVerifyByCookie, Wine_controller_1["default"].getWineByCountry);
    /** DELETE requires wineId, removes this.wine from collection.wines*/
    app["delete"]('/wine/delete/:wineId', PasswordUtils_1["default"].authVerifyByCookie, Wine_controller_1["default"].deleteWineById);
};
exports["default"] = { wineRoutes: wineRoutes };
