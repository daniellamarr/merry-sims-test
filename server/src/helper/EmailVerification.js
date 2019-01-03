import jwt from 'jsonwebtoken';
import Sendgrid from 'sendgrid';
import { mail as helper } from 'sendgrid';
import dotenv from 'dotenv';
import models from '../models';

dotenv.config();
const { localUsers } = models;
const sendgrid = Sendgrid(process.env.SENDGRID_KEY);
const secret = process.env.SECRETE_KEY;

class EmailVerification {
  static async sendVerifyLink(req, email, token) {
    const host = req.get('host');
    const link = `http://${host}/api/v1/auth/users/verify/${token}`;
    const from_email = new helper.Email('merry@gmail.com');
    const to_email = new helper.Email(email);
    const subject = 'Merry verify authors haven link';
    const content = new helper.Content('text/plain', link);
    const mail = new helper.Mail(from_email, subject, to_email, content);

    const request = sendgrid.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    });
    try {
      await sendgrid.API(request);
    } catch (err) {
      console.log(err);
    }
  }

  static async verifyToken(req, res, next) {
    const token = req.params.token;

    try {
      await jwt.verify(token, secret, (err, authData) => {
        if (err) {
          return res.status(401).json({
            message: 'Invalid Verification Link',
            error: true,
          });
        }
        req.authData = authData;
        return next();
      });
    } catch (err) {
      console.log(err);
    }
  }

  static async verifyLink(req, res) {
    try {
      const findOne = await localUsers.findById(req.authData.id);
      if (!findOne) {
        return res.status(404).send({
          message: 'Account Not Found',
        });
      }

      await findOne
        .update({
          status: 1,
        });
      res.status(200).json({ message: 'Email verified successfully' });
    } catch (err) {
      console.log(err);
    }
  }
}

export default EmailVerification;
