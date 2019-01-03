import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Op } from 'sequelize';

import models from '../models';
import { EmailVerification } from '../helper';
import Response from '../helper/response';

dotenv.config();
const secret = process.env.SECRETE_KEY;
const { localUsers } = models;

/**
 * @description Defines the actions to for the users endpoints
 * @class UserController
 */
let responseObject;

class UserController {
  static async signUp(req, res) {
    const {
      name, email, password, image, bio,
    } = req.body;
    const hash = bcrypt.hashSync(password, 10);

    try {
      const localUser = await localUsers
        .create({
          name,
          email,
          password: hash,
          bio,
          image,
          status: 0,
        });
      const id = localUser.dataValues.id;
      const authDetail = {
        id, name, email, bio, image,
      };
      const token = await jwt.sign(authDetail, secret, { expiresIn: '100hr' });
      EmailVerification.sendVerifyLink(req, email, token);
      res.status(201).json({
        authDetail,
        token,
      });
    } catch (err) {
      console.log(err);
    }
  }

  static async profile(req, res) {
    console.log(req);
    res.json({ message: 'welcome to your dashboard' });
  }

  static async login(req, res) {
    const {
      name, email, password,
    } = req.body;

    const nameOrEmail = email || name;
    try {
      const authenticateUser = await localUsers.findOne({
        where: {
          [Op.or]: [{ name: nameOrEmail }, { email: nameOrEmail }],
        },
      });


      if (authenticateUser) {
        const userData = authenticateUser.dataValues;

        const confirmPassword = bcrypt.compareSync(password, userData.password);
        delete userData.password; delete userData.email;


        if (!confirmPassword) {
          responseObject = new Response('OK', 400, 'Authentication failed: Wrong Password', '');
          return res.status(responseObject.code).json(responseObject);
        }

        if (userData.status === 1) {
          const token = await jwt.sign(userData, secret, { expiresIn: '100hr' });

          responseObject = new Response('OK', 200, 'Authentication successful', token);
          res.status(responseObject.code).json(responseObject);
        } else {
          responseObject = new Response('OK', 200, 'Activation Required', `Dear ${userData.name || 'User'}, kindly activate your account to access the application, Thanks`);
          res.status(responseObject.code).json(responseObject);
        }
      } else {
        responseObject = new Response('OK', 404, 'User not found', 'User not found :(. Kindly Get Register');
        res.status(responseObject.code).json(responseObject);
      }
    } catch (e) {
      console.log(e);
    }
  }
}

export default UserController;
