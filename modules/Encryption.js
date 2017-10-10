import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { PUBLIC_KEY } from '../conf/settings'

const genRandomString = (length) => {
  return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0,length)   /** return required number of characters */
}

const sha512 = (password, salt) => {
  const hash = crypto.createHmac('sha512', salt)
  hash.update(password)
  const value = hash.digest('hex')

  return {
    salt:salt,
    passwordHash:value
  }
}

const saltHashPassword = (userPassword) => {
    const salt = genRandomString(16) /** Gives us salt of length 16 */
    const passwordData = sha512(userPassword, salt)
    // console.log('UserPassword = '+userPassword)
    // console.log('Passwordhash = '+passwordData.passwordHash)
    // console.log('nSalt = '+passwordData.salt)
    return passwordData
}

const makeJWTToken = (payload, hash_password, options) => {
  const token = jwt.sign(payload, hash_password, options)

  return token
}

const decodeJWT = (token) => {
  try {
    var decoded = jwt.verify(token, PUBLIC_KEY)
    return decoded.userID
  } catch(err) {
    // err
    return false
  }
}

export {
  makeJWTToken,
  decodeJWT,
  saltHashPassword,
  sha512,
  genRandomString
}
