import passport from 'passport'
import mongoose from 'mongoose'

import Post from '../../models/Post'


function isValidObjectID (string) {
  return mongoose.Types.ObjectId.isValid(string)
}


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

  router.get('/posts/:id',
    (req, res) => {
      let { id } = req.params
      if (!isValidObjectID(id)) {
        res.status(404).json({info: 'not found'})
      }

      Post.findById(id)
        .exec()
        .then((post) => {
          if (post) {
            res.json(post)
          } else {
            res.status(404).json({info: 'not found'})
          }
        })
        .catch((err) => {
          res.status(500).json(err)
        })
    }
  )

  router.put('/posts/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      let { id } = req.params
      if (!isValidObjectID(id)) {
        res.status(404).json({info: 'not found'})
      }

      Post.findById(id)
        .exec()
        .then((post) => {
          if (post && post.isAuthor(req.user)) {
            const data = Object.assign({}, req.body, {
              last_modified_at: (new Date()).getTime()
            })
            post.updateData(data)
            return post.save()
          } else {
            res.status(404).json({info: 'not found'})
          }
        })
        .then((post) => {
          console.log('Post Updated')
          res.json(post)
        })
        .catch((err) => {
          res.status(500).json(err)
        })
    }
  )

  router.delete('/posts/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      let { id } = req.params
      if (!isValidObjectID(id)) {
        res.status(404).json({info: 'not found'})
      }

      Post.findById(id)
        .exec()
        .then((post) => {
          if (post && post.isAuthor(req.user)) {
            return post.remove()
          } else {
            res.status(404).json({info: 'not found'})
          }
        })
        .then((post) => {
          console.log('Post Removed')
          res.json(post)
        })
        .catch((err) => {
          res.status(500).json(err)
        })
    }
  )

  router.post('/posts/:id/like',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      let { id } = req.params
      if (!isValidObjectID(id)) {
        res.status(404).json({info: 'not found'})
      }

      Post.findById(id)
        .exec()
        .then((post) => {
          if (post) {
            post.addLike(req.user)
            return post.save()
          } else {
            res.status(404).json({info: 'not found'})
          }
        })
        .then((post) => {
          console.log('Post Liked by you!')
          res.json(post)
        })
        .catch((err) => {
          res.status(500).json(err)
        })
    }
  )

  router.post('/posts/:id/view',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      let { id } = req.params
      if (!isValidObjectID(id)) {
        res.status(404).json({info: 'not found'})
      }

      Post.findById(id)
        .exec()
        .then((post) => {
          if (post) {
            post.addView(req.user)
            return post.save()
          } else {
            res.status(404).json({info: 'not found'})
          }
        })
        .then((post) => {
          console.log('Post Viewed by you!')
          res.json(post)
        })
        .catch((err) => {
          res.status(500).json(err)
        })
    }
  )
}
