import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { prisma } from '../../data';
import { decodeBasicToken, customErrors } from './services';
import './model';

export const login = async (ctx) => {
  try {
    const [email, password] = decodeBasicToken(
      ctx.request.headers.authorization
    );

    const user = await prisma.user.findUnique({
      where: { email, password },
    });

    if (!user) {
      ctx.status = 404;
      return;
    }

    // const passwordMatch = await bcrypt.compare(password, user.password);

    // if (!passwordMatch) {
    //   ctx.status = 404;
    //   return;
    // }

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET);

    ctx.body = { user, token };
  } catch (error) {
    if (error.message in customErrors) {
      ctx.status = customErrors(error.message);
      return;
    }

    ctx.status = 500;
    ctx.body = 'Something went wrong, try again!';
  }
};

export const list = async (ctx) => {
  try {
    const users = await prisma.user.findMany();
    ctx.body = users;
  } catch (error) {
    ctx.status = 500;
    ctx.body = 'Something went wrong, try again!';
  }
};

export const create = async (ctx) => {
  try {
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(
      ctx.request.body.password,
      saltRounds
    );

    const { password, ...user } = await prisma.user.create({
      data: {
        name: ctx.request.body.name,
        email: ctx.request.body.email,
        password: hashedPassword,
      },
    });

    ctx.body = user;
  } catch (error) {
    ctx.status = 500;
    ctx.body = 'Something went wrong, try again!';
  }
};

export const update = async (ctx) => {
  const { name, email } = ctx.request.body;

  try {
    const user = await prisma.user.update({
      where: { id: ctx.params.id },
      data: { name, email },
    });
    ctx.body = user;
  } catch (error) {
    ctx.status = 500;
    ctx.body = 'Something went wrong, try again!';
  }
};

export const remove = async (ctx) => {
  try {
    await prisma.user.delete({
      where: { id: ctx.params.id },
    });
    ctx.body = { id: ctx.params.id };
  } catch (error) {
    ctx.status = 500;
    ctx.body = 'Something went wrong, try again!';
  }
};
