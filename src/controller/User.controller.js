import UserModel from '../model/User.model.js';
import StatusCode from '../../config/StatusCode.js';

const createUser = async (req, res) => {
  const user = new UserModel({
    username: req.body.username,
    password: req.body.password,
  });

  try {
    const response = await user.save();
    res.status(StatusCode.CREATED).send(response);
  } catch (error) {
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
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

export default {
  createUser,
  getAllUSers,
  getUserById,
  getUserByUserNameQuery,
  updateUser,
  deleteUserById,
  getUserByUserNameQueryWithoutAuth,
};
