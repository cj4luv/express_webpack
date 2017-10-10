// DB의 접근
import mysql from 'mysql'
const conf = require('../conf').get(process.env.NODE_ENV)
const pool = mysql.createPool(conf.db.local_connection)

import redis from 'redis'
const client = redis.createClient(6379,'127.0.0.1')

import { decodeJWT } from '../modules/Encryption'
import { logAndRespond } from '../modules/Utill'
import { TOKEN_EXPIRE_TIME } from '../conf/settings'
import { days } from '../modules/Utill';

// 회원 가입
const signUp = (req, res) => {
  pool.getConnection((err, connection) => {
    const insertQuery = 'insert into users set ?'
    connection.query(insertQuery, [req.body], (err, rows) => {
      if (err) {
          // res.end(JSON.stringify(err))
          res.end('사용 하실수 없는 아이디 입니다.')
      } else {
        res.statusCode = 202; // accepted
        const msg = JSON.stringify({
            result: 'Insert success',
            err:    '',
            json:   req.body,
            length: rows.length
        });
        res.end(msg)
      }
      connection.release()
    });
  });
}

// 비밀번호 키값
const getPasswordkey = (req, res) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
        connection.query('SELECT * FROM users WHERE userID = '
        + connection.escape(req.body.userID),
        (err, rows) => {
          if(err) { reject(null) }
          else {
            resolve(rows[0].password_key)
          }
          if(rows.length === 0){ res.send(204); return; }
        })
      connection.release()
    })
  })
}

// login
const login = (req, res) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.query('SELECT * FROM users WHERE userID = '
      + connection.escape(req.body.userID) + 'AND password = '
      + connection.escape(req.body.password),
      (err, rows) => {
        if (err){ reject(false) }
        else {
          let data = {
            rows,
            token: (token) => {
              setToken(req.body.userID, token)
            }
          }
          resolve(data)
        }
        if (rows.length === 0){ res.send(204); return; }
      })
      connection.release()
    })
  })
}

// set redis db
const setToken = (userID, token) => {
  client.set(userID, token, 'EX', days(TOKEN_EXPIRE_TIME))
}

// auth middle ware
const checkedToken = (token) => {
  return new Promise((resolve, reject) => {
    const auth = decodeJWT(token)

    if(auth) {
      client.get(auth, (err, reply) => {
        if(err) {
            res.send('redis error')
        } else {
          if(reply === token) {
            resolve(true)
          } else {
            resolve(false)
          }
        }
      })
    } else {
      console.log('auth false')
      reject('redis err')
    }
  })

}

export {
  signUp,
  login,
  getPasswordkey,
  checkedToken
}
