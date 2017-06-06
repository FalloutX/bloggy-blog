import express from 'express'
import passport from 'passport'
const router = express.Router()

/**
 * @Route -> /api/me -> {req.user}
 * Return the current Authenticated User.
 */
router.get('/me',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json(req.user)
  }
)


export default router
