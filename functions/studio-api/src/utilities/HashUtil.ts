import crypto from 'crypto';

// from: https://stackoverflow.com/a/45652825

const PASSWORD_LENGTH = 256;
const SALT_LENGTH = 64;
const DIGEST = 'sha256';
const ENCODING_FORMAT = 'base64url';

/**
 * The information about the password that is stored in the database
 */
export interface HashedPassword {
  salt: string;
  hash: string;
  iterations: number;
}

/**
 * Generates a HashedPassword given the password provided by the user.
 * This should be called when creating a user or redefining the password
 */
export function hashPassword(password: string): Promise<HashedPassword> {
  return new Promise<HashedPassword>((resolve, reject) => {
    const salt = crypto.randomBytes(SALT_LENGTH).toString(ENCODING_FORMAT);

    const rand = (min: number, max: number) =>
      Math.ceil(Math.random() * (max + 1 - min) + min);
    const iterations = rand(5, 500);

    crypto.pbkdf2(
      password,
      salt,
      iterations,
      PASSWORD_LENGTH,
      DIGEST,
      (error, hash) => {
        if (error) {
          return reject(error);
        }

        resolve({
          salt,
          hash: hash.toString(ENCODING_FORMAT),
          iterations
        });
      }
    );
  });
}

/**
 * Verifies the attempted password against the password information saved in
 * the database. This should be called when
 * the user tries to log in.
 */
export function verifyPassword(
  hashedPassword: HashedPassword,
  passwordAttempt: string
): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    crypto.pbkdf2(
      passwordAttempt,
      hashedPassword.salt,
      hashedPassword.iterations,
      PASSWORD_LENGTH,
      DIGEST,
      (error, hash) => {
        if (error) {
          return reject(error);
        }

        resolve(hashedPassword.hash === hash.toString(ENCODING_FORMAT));
      }
    );
  });
}