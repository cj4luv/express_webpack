import {
  signUp,
  login,
  getPasswordkey } from '../../../models/user'

import {
  saltHashPassword,
  sha512,
  makeJWTToken,
  genRandomString } from '../../../modules/Encryption';

import { TOKEN_EXPIRE_TIME } from '../../../conf/settings'

import { days } from '../../../modules/Utill';

// post area
exports.register = (req, res) => {
  const password = req.body.password
  const hashData = saltHashPassword(password)

  req.body.password = hashData.passwordHash
  req.body.password_key = hashData.salt

  signUp(req, res)
}

exports.login = (req, res) => {
  const userID = req.body.userID
  const password = req.body.password

  const payload = {
   iss:'localhost.com',
   "http://localhost:3001/api/auth/register": true,
   userID: userID
  }

  getPasswordkey(req, res).then((salt) => {
    if(salt !== null) {
      const hash_password = sha512(password, salt).passwordHash
      const publicKey = 'fifty'
      const token = makeJWTToken(payload, publicKey, { expiresIn: days(TOKEN_EXPIRE_TIME) })
      req.body.password = hash_password

      login(req, res).then( result => {
        if(result === false) {
          res.send('아이디나 비밀번호가 잘못 되었습니다.')
        } else {
          const msg = {
              result: 'Get success',
              err:    '',
              json:   result.rows,
              token:  token,
              length: result.rows.length
          }
          result.token(token)
          res.json(msg)
        }
      })
    }
  })

}
