'use strict';
exports.__esModule = true;
var User_controller_1 = require('../controller/User.controller');
var path_1 = require('path');
var PasswordUtils_1 = require('../lib/PasswordUtils');
var availableRoutes = [
    '/register',
    '/login',
    '/profile',
    '/logout',
    '/wine/add',
    '/wine/update',
    '/wine/getall',
    '/wine/getbyid',
    '/wine/getbyname',
    '/wine/bycountry',
    '/wine/delete',
    '/user/addfavoritewine',
    '/user/deletewine',
    '/user/forgotpassword',
    '/user/getall',
    '/user/getbyid'
];
var userRoutes = function (app) {
    //sending layout to login and register
    app.get('/register', function (req, res) {
        var _a;
        if (!((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token)) {
            console.log(__dirname);
            res.sendFile(path_1['default'].join(__dirname, '../../register.html'));
        }
        else {
            res.redirect('/profile');
        }
    });
    app.get('/login', function (req, res) {
        if (!req.cookies.token) {
            res.sendFile(path_1['default'].join(__dirname, '../../login.html'));
        }
        else {
            res.redirect('/profile');
        }
    });
    app.get('/', function (req, res) {
        res.send({
            message: 'Wine Api',
            Goto: '/login',
            links: '' + Object.values(availableRoutes)
        });
    });
    app.post('/register', User_controller_1['default'].handleRegister);
    app.post('/login', User_controller_1['default'].handleLogin);
    /** GET show this.user profile */
    app.get('/profile', PasswordUtils_1['default'].authVerifyByCookie, User_controller_1['default'].showProfile);
    app.get('/logout', User_controller_1['default'].logout);
    app.post('/user/forgotpassword', User_controller_1['default'].handleForgottPassword);
    app.post('/user/resetPassword/:temporaryToken', User_controller_1['default'].handleResetPassword);
    /**PATCH requires wineId,  Adds this.wine to this.user favoritwines */
    app.patch('/user/addfavoritewine/:wineId', PasswordUtils_1['default'].authVerifyByCookie, User_controller_1['default'].addFavoriteWine);
    /**PUT requires wineId, removes this.wine from this.user favoritwines */
    app.put('/user/deletewine/:wineId', PasswordUtils_1['default'].authVerifyByCookie, User_controller_1['default'].deleteWineFromUsersList);
    //ADMIN ROUTS - USER
    app.get('/user/getall', PasswordUtils_1['default'].authVerifyByCookie, User_controller_1['default'].getAllUSers);
    app.get('/user/getbyid/:userId', PasswordUtils_1['default'].authVerifyByCookie, User_controller_1['default'].getUserById);
    app.get('/user/getbyname/:username', PasswordUtils_1['default'].authVerifyByCookie, User_controller_1['default'].getUserByUserNameQuery);
    app['delete']('/user/delete/:userId', PasswordUtils_1['default'].authVerifyByCookie, User_controller_1['default'].deleteUserById);
};
exports['default'] = {
    userRoutes: userRoutes
};
