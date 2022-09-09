import request from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from './data/index';
import { app } from './server-setup';

const server = app.listen();

describe('User routes', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
  });

  it('should return not found with wrong password', async () => {
    const email = 'jpsaless2002@gmail.com';
    const password = 'errado';

    const result = await request(server).get('/login').auth(email, password);

    expect(result.status).toBe(404);
  });

  it('should return not found with wrong email', async () => {
    const email = 'errado@gmail.com';
    const password = '12345';

    const result = await request(server).get('/login').auth(email, password);

    expect(result.status).toBe(404);
  });

  it('should return logged in user by correct credentials', async () => {
    const email = 'teste@gmail.com';
    const password = '12345';

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    const result = await request(server).get('/login').auth(email, password);
    const decodedToken = jwt.verify(result.body.token, process.env.JWT_SECRET);

    expect(result.status).toBe(200);
    expect(result.body.user).toBeTruthy();
    expect(result.body.token).toBeTruthy();
    expect(result.body.user.id).toBe(user.id);
    expect(result.body.user.email).toBe(email);
    expect(result.body.user.password).toBeFalsy();
    expect(decodedToken.sub).toBe(user.id);
  });
});
