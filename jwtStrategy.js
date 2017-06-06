import { Strategy, ExtractJwt } from 'passport-jwt'
import config from './config'
import User from './models/User'

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: config.jwt.secret
}

const strategy = new Strategy(opts, (jwtPayload, done) => {
  User.findById(jwtPayload.username, (err, user) => {
    if (err) {
      return done(err, false)
    }

    if (!user) {
      return done(null, false)
    }

    return done(null, user, { scope: 'all' })
  })
})

export default strategy
