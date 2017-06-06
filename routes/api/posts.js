import passport from 'passport'

import Post from '../../models/Post'


export default function posts (router) {
  router.post('/posts/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      console.log(req.body)
      const currentTime = (new Date()).getTime()
      const data = Object.assign({}, req.body, {
        authorId: req.user._id,
        created_at: currentTime,
        last_modified_at: currentTime
      })

      let post = new Post(data)

      post.save()
      .then((savedPost) => {
        res.json(savedPost)
      })
      .catch((err) => {
        res.status(400).json({err})
      })
    }
  )

  router.get('/posts/',
    (req, res) => {
      let { before } = req.query
      if (!before) {
        before = (new Date()).getTime()
      }
      Post.find({ created_at: { $lte: before } })
      .limit(20)
      .sort('-created_at')
      .exec()
      .then((posts) => {
        res.json(posts)
      })
      .catch(err => {
        res.status(400).json(err)
      })
    }
  )
}
