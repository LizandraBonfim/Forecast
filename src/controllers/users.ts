import { Request, Response } from 'express';
import { Controller, Post } from '@overnightjs/core';
import mongoose from 'mongoose';
import { User } from '@src/models/user';
import { BaseController } from '.';
import AuthService from '@src/services/auth';

@Controller('users')
export class UsersController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      const result = await user.save();

      res.status(201).send(result);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Post('authenticate')
  public async authenticate(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return;
    }

    if (!(await AuthService.comparePassword(password, user.password ))) {
      return;
    }

    const token = AuthService.generateToken(user.toJSON());
    res.status(200).send({ token: token });
  }
}
