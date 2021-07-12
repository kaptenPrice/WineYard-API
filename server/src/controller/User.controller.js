import UserModel from '../model/User.model.js';

const createUser = async (req, res) => {
  const user = new UserModel({
    username: req.body.username,
    password: req.body.password,
  });

  try {
    const response = await user.save();
    res.status(201).send(response);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getAllUSers = async (req, res) => {
  try {
    const response = await UserModel.find();
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const response = await UserModel.findById(req.params.userId);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({
      error: error.message,
      message:
        'Error occured while trying to retrieve user with ID:' +
        req.params.userId,
    });
  }
};

const getUserByUserNameQuery = async (req, res) => {
  try {
    const response = await UserModel.find({ username: req.query.username });
    response.length !== 0
      ? res.status(200).send(response)
      : res
          .status(404)
          .send({ message: 'Couldnt fint user ' + req.query.username });
  } catch (error) {
    res.status(500).send({
      error: error.message,
      message:
        'Error occured while trying to retrieve user with username:' +
        req.query.userName,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      return res.status(400).send({ message: 'Cannot update empty values' });
    }

    const response = await UserModel.findByIdAndUpdate(
      req.params.userId,
      {
        username: req.body.username,
        password: req.body.password,
      },
      { new: true }
    );
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({
      message:
        'Error occured while trying to update values of the user with ID:' +
        req.query.userId,
    });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const response = await UserModel.findByIdAndDelete(req.params.userId);
    res
      .status(200)
      .send({
        message: `Successfully deleted: ${response.username} and ID ${response._id}`,
      });
  } catch (error) {
    res.status(500).send({
      message:
        'Error occured while trying to find and delete user with ID:' +
        req.params.userId,
    });
  }
};

export default {
  createUser,
  getAllUSers,
  getUserById,
  getUserByUserNameQuery,
  updateUser,
  deleteUserById,
};
