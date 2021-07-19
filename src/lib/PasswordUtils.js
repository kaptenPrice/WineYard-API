import crypto from 'crypto';

const passwordValidator = (password, hash, salt) => {
  const hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  return hash === hashVerify;
};
const passwordGenerator = (password) => {
  const salt = crypto.randomBytes(32).toString('hex');
  const generatedHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  return {
    salt: salt,
    hash: generatedHash,
  };
};

export default {
  passwordValidator,
  passwordGenerator,
};
