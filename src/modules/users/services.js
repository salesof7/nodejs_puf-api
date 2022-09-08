export const decodeBasicToken = (basicToken) => {
  const [type, credentials] = basicToken.split(' ');

  if (type !== 'Basic') {
    throw new Error('Wrong token type');
  }

  const decoded = Buffer.from(credentials, 'base64').toString();
  const encoded = Buffer.from(decoded, 'utf-8').toString('base64');

  if (encoded !== credentials) {
    throw new Error('Credentials are not encoded correctly');
  }

  if (decoded.indexOf(':') === -1) {
    throw Error('Wrong credentials format');
  }

  return decoded.split(':');
};

export const customErrors = {
  'Wrong token type': 400,
  'Credentials are not encoded correctly': 400,
  'Wrong credentials format': 400,
};
