import UserModel from '../model/User.model.js';
import AUTH0 from 'express-openid-connect';
import StatusCode from '../../config/StatusCode.js';
import WineModel from '../model/Wine.model.js';

const createUser = async (req, res) => {
  if (req.oidc.isAuthenticated() && !email_verified) {
    try {
      new UserModel({ nickname, email }).save();
      res.status(StatusCode.CREATED).send(response);
    } catch (error) {
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .send({ message: error.message });
    }
  }

  // if (!req.body.username || !req.body.password) {
  //   res.status(StatusCode.BAD_REQUEST);
  //   res.send({ message: 'Cannot create a user wth empty value' });
  //   res.end();
  // } else {
  //   const user = new UserModel({
  //     username: req.body.username,
  //     password: req.body.password,
  //   });
  // try {
  //   const response = await user.save();
  //   res.status(StatusCode.CREATED).send(response);
  // } catch (error) {
  //   res
  //     .status(StatusCode.INTERNAL_SERVER_ERROR)
  //     .send({ message: error.message });
  // }
  // }
};

const getAllUSers = async (req, res) => {
  try {
    const response = await UserModel.find();
    res.status(StatusCode.OK).send(response);
  } catch (error) {
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const response = await UserModel.findById(req.params.userId);
    res.status(StatusCode.OK).send(response);
  } catch (error) {
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      error: error.message,
      message:
        'Error occured while trying to retrieve user with ID:' +
        req.params.userId,
    });
  }
};

const getUserByUserNameQuery = async (req, res) => {
  try {
    const response = await UserModel.find({ username: req.params.username });
    response.length !== 0
      ? res.status(StatusCode.OK).send(response)
      : res
          .status(StatusCode.NOTFOUND)
          .send({ message: 'Couldnt find user ' + req.params.username });
  } catch (error) {
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      error: error.message,
      message:
        'Error occured while trying to retrieve user with username:' +
        req.params.userName,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      return res
        .status(StatusCode.BAD_REQUEST)
        .send({ message: 'Cannot update empty values' });
    }

    const response = await UserModel.findByIdAndUpdate(
      req.params.userId,
      {
        username: req.body.username,
        password: req.body.password,
      },
      { new: true }
    );
    res.status(StatusCode.OK).send(response);
  } catch (error) {
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      message:
        'Error occured while trying to update values of the user with ID:' +
        req.query.userId,
    });
  }
};
/**
 * 
 * @param {*} req Wine ID
 * @param {*} res Authenticated users added wines

 */

const addMyFavoriteWine = async (req, res) => {
  try {
    const { email } = req.oidc.user;
    const favoriteWine = await WineModel.findById(req.params.wineId);

    if (favoriteWine !== null || favoriteWine !== undefined) {
      const { name, _id, country, description, grapes , year } = favoriteWine;

      const authenticatedUser = await UserModel.findOneAndUpdate(
        email,
        {
          $addToSet: { favoriteWines: { name, _id, country, description, grapes , year} },
        },
        { new: true }
      );

      res.status(StatusCode.OK).send(authenticatedUser);
    }
  } catch (error) {
    if(req.params.wineId.length === 0)
    res.status(StatusCode.NOTFOUND).send({
      message: `Sorry from the API but you maybe took to many glas of wine.... ${req.params.wineId} is not a valid Id`,
    });
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};
/***
 *
 *
 *
 *
 */
//TODO DELETE FAVVOVIN








/***
 * 
 * 
 * 
 * 
 * 
 */
const deleteUserById = async (req, res) => {
  try {
    const response = await UserModel.findByIdAndDelete(req.params.userId);
    res.status(StatusCode.OK).send({
      message: `Successfully deleted: ${response.username} and ID ${response._id}`,
    });
  } catch (error) {
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      message:
        'Error occured while trying to find and delete user with ID:' +
        req.params.userId,
    });
  }
};

const getUserByUserNameQueryWithoutAuth = async (req, res, next) => {
  req.oidc.isAuthenticated()
    ? next()
    : res.send({ data: 'data without required Auth' });
};
const createUserIfEmailIsVerified = async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    const { nickname, email_verified, email } = req.oidc.user;
    if (!email_verified) {
      try {
        await new UserModel({ nickname, email }).save();
        res.status(StatusCode.CREATED);
        res.send(
          `Welcome ${nickname}!\n You need to verify your email before be able to use this API.`
        );
      } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
          message:
            'You have to verify your email or logout and login again if you have done that.',
        });
      }
    } else {
      res.send(`Cheers ${nickname}!`);
    }
  } else {
    res.writeHead(StatusCode.FOUND, {
      Location: '/login',
    });
    res.end();
  }
};
//TODO SE MINA VINER





export default {
  createUser,
  getAllUSers,
  getUserById,
  getUserByUserNameQuery,
  updateUser,
  deleteUserById,
  getUserByUserNameQueryWithoutAuth,
  createUserIfEmailIsVerified,
  addMyFavoriteWine,
};
