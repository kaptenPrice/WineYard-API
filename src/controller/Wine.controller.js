import WineModel from '../model/Wine.model.js';
import StatusCode from '../../config/StatusCode.js';
import { objectFilter } from '../middleware/MiddleWares.js';

const addWine = async (req, res) => {
  const { name, country, description, grapes, year } = req.body;
  const { email_verified } = req.oidc.user;
  if (email_verified) {
    try {
      if (!name || !country) {
        return res
          .status(StatusCode.BAD_REQUEST)
          .send({ message: 'Cannot insert empty values' });
      }
      const response = await new WineModel({
        name,
        country,
        description,
        grapes,
        year,
      }).save();
      res.status(StatusCode.CREATED).send(response);
    } catch (error) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
        message: `${name} already exists`,
        error: error.message,
        //TODO ADD error.message to logfile
      });
    }
  } else {
    res
      .status(StatusCode.UNAUTHORIZED)
      .send({ message: 'Please verify Email first then log in again' });
  }
};

const getAllWines = async (req, res) => {
  const { email_verified } = req.oidc.user;
  if (email_verified) {
    try {
      const response = await WineModel.find();
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

const getWineById = async (req, res) => {
  const { email_verified } = req.oidc.user;
  if (email_verified) {
    try {
      const response = await WineModel.findById(req.params.wineId);
      res.status(StatusCode.OK).send(response);
    } catch (error) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
        error: error.message,
        message:
          'Error occured while trying to retrieve user with ID:' +
          req.params.wineId,
      });
    }
  } else {
    res
      .status(StatusCode.UNAUTHORIZED)
      .send({ message: 'Please verify Email first then log in again' });
  }
};

const getWineByName = async (req, res) => {
  const { name } = req.params;
  const { email_verified } = req.oidc.user;
  if (email_verified) {
    try {
      const response = await WineModel.find({ name: name.toUpperCase() });
      response.length !== 0
        ? res.status(StatusCode.FOUND).send(response)
        : res.status(StatusCode.NOTFOUND).send({
            message: `Couldnt find wine ${name}`,
          });
    } catch (error) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
        error: error.message,
        message: `Error occured while trying to retrieve ${name}`,
      });
    }
  } else {
    res
      .status(StatusCode.UNAUTHORIZED)
      .send({ message: 'Please verify Email first then log in again' });
  }
};

const getWineByCountry = async (req, res) => {
  const { country } = req.params;
  const { email_verified } = req.oidc.user;
  if (email_verified) {
    try {
      const response = await WineModel.find({ country });
      response.length !== 0
        ? res.status(StatusCode.FOUND).send(response)
        : res.status(StatusCode.NOTFOUND).send({
            message: `Couldnt find any wines from  ${country}`,
          });
    } catch (error) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
        error: error.message,
        message: `Error occured while trying to retrieve ${country}`,
      });
    }
  } else {
    res
      .status(StatusCode.UNAUTHORIZED)
      .send({ message: 'Please verify Email first then log in again' });
  }
};

const updateWine = async (req, res) => {
  let { name, country, description, grapes, year } = req.body;
  const { email_verified } = req.oidc.user;
  if (email_verified) {
    try {
      if (!name && !country && !grapes && !year && !description) {
        return res
          .status(StatusCode.BAD_REQUEST)
          .send({ message: 'Cannot insert empty values' });
      }
      const response = await WineModel.findByIdAndUpdate(
        req.params.wineId,
        objectFilter(
          {
            name,
            country,
            grapes,
            year,
            description,
          },
          [null, '']
        ),
        { new: true, omitUndefined: true }
      );
      res.status(StatusCode.OK).send(response);
    } catch (error) {
      if (error.message.includes('E11000')) {
        res.status(StatusCode.FORBIDDEN).send({
          message: `${name} already exists`,
        });
      } else
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
          message:
            'Error occured while trying to update values of the wine with ID:' +
            req.params.wineId,
          error: error.message,
        });
    }
  } else {
    res
      .status(StatusCode.UNAUTHORIZED)
      .send({ message: 'Please verify Email first then log in again' });
  }
};

const deleteWineById = async (req, res) => {
  const { email_verified } = req.oidc.user;
  if (email_verified) {
    try {
      const response = await WineModel.findByIdAndDelete(req.params.wineId);
      res.status(StatusCode.OK).send({
        message: `Successfully deleted: ID ${response._id}`,
      });
    } catch (error) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
        message:
          'Error occured while trying to find and delete wine with ID:' +
          req.params.wineId,
        error: error.message,
      });
    }
  } else {
    res
      .status(StatusCode.UNAUTHORIZED)
      .send({ message: 'Please verify Email first then log in again' });
  }
};

export default {
  getWineById,
  getAllWines,
  addWine,
  updateWine,
  getWineByName,
  getWineByCountry,
  deleteWineById,
};
