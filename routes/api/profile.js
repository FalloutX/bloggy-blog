import passport from 'passport'


export default function profile (router) {
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
}
