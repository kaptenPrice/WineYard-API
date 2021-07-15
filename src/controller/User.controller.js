import UserModel from '../model/User.model.js';
import StatusCode from '../../config/StatusCode.js';
import WineModel from '../model/Wine.model.js';
/**
 * Admin-functions */

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
};

const getAllUSers = async (req, res) => {
  const { email_verified } = req.oidc.user;
  if (email_verified) {
    try {
      const response = await UserModel.find();
      res.status(StatusCode.OK).send(response);
    } catch (error) {
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .send({ message: error.message });
    }
  } else {
    res
      .status(StatusCode.UNAUTHORIZED)
      .send({ message: 'Please verify Email first then log in again' });
  }
};

const getUserById = async (req, res) => {
  const { email_verified } = req.oidc.user;
  if (email_verified) {
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
  } else {
    res
      .status(StatusCode.UNAUTHORIZED)
      .send({ message: 'Please verify Email first then log in again' });
  }
};

const getUserByUserNameQuery = async (req, res) => {
  const { email_verified } = req.oidc.user;
  if (email_verified) {
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
  } else {
    res
      .status(StatusCode.UNAUTHORIZED)
      .send({ message: 'Please verify Email first then log in again' });
  }
};

const updateUser = async (req, res) => {
  const { email_verified } = req.oidc.user;
  if (email_verified) {
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
  } else {
    res
      .status(StatusCode.UNAUTHORIZED)
      .send({ message: 'Please verify Email first then log in again' });
  }
};
const deleteUserById = async (req, res) => {
  const { email_verified } = req.oidc.user;
  if (email_verified) {
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
  } else {
    res
      .status(StatusCode.UNAUTHORIZED)
      .send({ message: 'Please verify Email first then log in again' });
  }
};

/**
 * Main-functions handle login, creating user in db, redirect etc.
 *
 */
const createUserIfEmailIsNotVerified = async (req, res, next) => {
  if (req.oidc.isAuthenticated()) {
    const { nickname, email_verified, email } = req.oidc.user;
    if (!email_verified) {
      try {
       await UserModel.findOneAndUpdate(
          { email },
          { email, nickname },
          { upsert: true }
        );

        await res.redirect(403, '/logout');
      } catch (error) {
        console.log(error.message);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
          message:
            'You have to verify your email or logout and login again if you have done that.',
        });
      }
    } else {
      next();
    }
  } else {
    res.writeHead(StatusCode.FOUND, {
      Location: '/login',
    });
    res.end();
  }
};

const showProfile = async (req, res) => {
  const { email_verified, email } = await req.oidc.user;
  if (email_verified) {
    try {
      const response = await UserModel.findOne({ email });
      res.status(StatusCode.OK).send(response);
    } catch (error) {
      res.status(StatusCode.NOTFOUND).send({ error: error.message });
    }
  } else {
    res
      .status(StatusCode.UNAUTHORIZED)
      .send({ message: 'Please verify Email first then log in again' });
  }
};

/**
 *User functions
 * @param {*Wine ID} req
 * @param {*Authenticateduser.favoriteWines} res
 */
const addFavoriteWine = async (req, res) => {
  const { email_verified, email } = await req.oidc.user;
  if (email_verified) {
    try {
      const favoriteWine = await WineModel.findById(req.params.wineId);

      const { name, _id, country, description, grapes, year } = favoriteWine;

      const authenticatedUser = await UserModel.findOneAndUpdate(
        email,
        {
          $addToSet: {
            favoriteWines: { name, _id, country, description, grapes, year },
          },
        },
        { new: true }
      );

      res.status(StatusCode.OK).send(authenticatedUser.favoriteWines);
    } catch (error) {
      if (error.message.includes('null')) {
        res.status(StatusCode.NOTFOUND).send({
          message: `Sorry from the sober API but you maybe took to many glasses of ${req.params.wineId}  is not a valid Id`,
        });
      } else if (error.message.includes('Cast')) {
        res.status(StatusCode.BAD_REQUEST).send({
          message: `Sorry but you need a ID to add a wine to your list`,
        });
      } else if (!req.params) {
        res.status(StatusCode.METHOD_NOT_ALLOWED).send({
          message: `Sorry but thats not a valid ID:  ${req.params} `,
        });
      } else {
        res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .send({ message: error.message });
      }
    }
  } else {
    res
      .status(StatusCode.UNAUTHORIZED)
      .send({ message: 'Please verify Email first then log in again' });
  }
};
/**
 * @param {*Wine ID} req
 * @param {*Authenticateduser.favoriteWines} res
 */
const deleteWineFromUsersList = async (req, res) => {
  const { email_verified, email } = await req.oidc.user;
  if (email_verified) {
    try {
      const reqWineIdInFavoriteWines = await UserModel.find(
        { email },
        {
          favoriteWines: { $elemMatch: { _id: req.params.wineId } },
        }
      );
      console.log(reqWineIdInFavoriteWines);

      if (reqWineIdInFavoriteWines[0]?.favoriteWines.length !== 0) {
        const authenticatedUser = await UserModel.findOneAndUpdate(
          { email },
          {
            $pull: { favoriteWines: { _id: req.params.wineId } },
          },
          { new: true }
        );

        authenticatedUser?.favoriteWines.length > 0
          ? res.status(StatusCode.OK).send(authenticatedUser.favoriteWines)
          : res.status(StatusCode.OK).send(authenticatedUser);
      } else {
        res
          .status(StatusCode.NOTFOUND)
          .send({ message: `${req.params.wineId} is not in your list` });
      }
    } catch (error) {
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .send({ error: error.message });
    }
  } else {
    res
      .status(StatusCode.UNAUTHORIZED)
      .send({ message: 'Please verify Email first then log in again' });
  }
};

/**
 *
 */
export default {
  showProfile,
  createUser,
  getAllUSers,
  getUserById,
  getUserByUserNameQuery,
  updateUser,
  deleteUserById,
  createUserIfEmailIsNotVerified,
  addFavoriteWine,
  deleteWineFromUsersList,
};
