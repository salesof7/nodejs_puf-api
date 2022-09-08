import request from 'supertest';
import { app } from './server-setup';

const server = app.listen();

describe('User routes', () => {
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
});
