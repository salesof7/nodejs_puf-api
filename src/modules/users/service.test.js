import { decodeBasicToken } from './services';

describe('User module', () => {
  it('should return credentials by basic authentication token', () => {
    const email = 'jpsaless2002@gmail.com';
    const password = '12345';

    const token = Buffer.from(`${email}:${password}`, 'utf-8').toString(
      'base64'
    );
    const basicToken = `Basic ${token}`;

    const result = decodeBasicToken(basicToken);

    expect(result).toEqual([email, password]);
  });

  it('should throw new error when token is not Basic type', () => {
    const email = 'jpsaless2002@gmail.com';
    const password = '12345';

    const token = Buffer.from(`${email}:${password}`, 'utf-8').toString(
      'base64'
    );
    const basicToken = `Bearer ${token}`;

    const result = () => decodeBasicToken(basicToken);

    expect(result).toThrowError('Wrong token type');
  });

  it('should throw new error when credentials is not on correct format', () => {
    const email = 'jpsaless2002@gmail.com';
    const password = '12345';

    const token = Buffer.from(`${email}${password}`, 'utf-8').toString(
      'base64'
    );
    const basicToken = `Basic ${token}`;

    const result = () => decodeBasicToken(basicToken);

    expect(result).toThrowError('Wrong credentials format');
  });

  it('should throw new error when credentials is not base64 encoded', () => {
    const email = 'jpsaless2002@gmail.com';
    const password = '12345';

    const token = `${email}${password}`;
    const basicToken = `Basic ${token}`;

    const result = () => decodeBasicToken(basicToken);

    expect(result).toThrowError('Credentials are not encoded correctly');
  });
});
