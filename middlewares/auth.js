import { checkedToken } from '../models/user'

export default (req, res, next) => {
  const method = req.method
  const url  = req.originalUrl

  const token = req.cookies.token

  if(url === '/api/auth/login' || token === undefined || url === '/api/auth/register') {
    console.log('cookies',url)
    next();
  } else {
    checkedToken(token).then( auth => {
      if(auth) {
        console.log("일치 로그인 완료");
        next();
      } else {
        res.send('토큰 불 일치 로그인 다시 시도 필요!')
      }
    })
    .catch((err) => {
      res.send(err)
    })
  }
}
