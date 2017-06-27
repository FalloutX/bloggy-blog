import express from 'express'
import config from '../config'
import passport from 'passport'

const router = express.Router()


router.get('/twitter',
  passport.authenticate('twitter', {
    session: false
  })
)


router.get('/twitter/return',
  passport.authenticate('twitter', {
    failureRedirect: '/login/twitter',
    session: false
  }),
  (req, res) => {
    // Redirect to frontend server with the access token in the request
    res.redirect(`${config.frontend.server}auth?jwt=${req.user.appToken}`)
  })


export default router
