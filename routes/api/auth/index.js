const router = require('express').Router()
import controller from './auth.controller'

router.post('/register', controller.register)

router.post('/login', controller.login)

module.exports = router
