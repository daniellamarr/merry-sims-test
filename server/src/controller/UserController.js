import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import models from '../models';
import { EmailVerification } from '../helper';
import dotenv from 'dotenv';
dotenv.config();
const secret = process.env.SECRETE_KEY;
const { localUsers } = models;
/**
 * @description Defines the actions to for the users endpoints
 * @class UserController
 */

 class UserController {
   static async signUp(req, res){
      
     const { name, email, password, image, bio } = req.body;
     const hash = bcrypt.hashSync(password, 10);

    try{
      const localUser = await localUsers
      .create({
        name,
        email,
        password: hash,
        bio,
        image,
        status: 0
      });
      const id = localUser.dataValues.id;
      const authDetail = {id, name, email, bio, image }
      const token = await jwt.sign(authDetail, secret, { expiresIn: '100hr' });
      EmailVerification.sendVerifyLink(req, email, token);
      res.status(201).json({
          authDetail,
          token
      })
    }
    catch(err){
     console.log(err)
    }
   }

   static async profile(req, res){
       console.log(req);
       res.json({message: 'welcome to your dashboard'});
   }
 }

 export default UserController;