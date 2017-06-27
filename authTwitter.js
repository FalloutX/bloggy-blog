import config from './config'
import passportTwitter from 'passport-twitter'
import User from './models/User'
import jwt from 'jsonwebtoken'

function generateJWT (username) {
  return jwt.sign({ username }, config.jwt.secret, { expiresIn: 60 * 60 * 24 * 100 })
}

function getFullProfilePicURL (picURL) {
  const normalStart = picURL.indexOf('_normal')
  if (normalStart !== -1) {
    return picURL.slice(0, normalStart) + '.jpg'
  } else {
    return picURL
  }
}

const authTwitter = new passportTwitter.Strategy({
  consumerKey: config.twitter.consumerKey,
  consumerSecret: config.twitter.consumerSecret,
  callbackURL: config.twitter.callbackURL
}, (token, tokenSecret, profile, cb) => {
  console.log('Authentication Successful => ', token, tokenSecret)
  User.findById(profile._json.screen_name, function (err, user) {
    console.log('my profile => ', profile)
    if (err) {
      console.log(err)
      return cb(err)
    }
    if (user) {
      user.twitterAccessToken = token
      user.twitterAccessTokenSecret = tokenSecret
      user.followers = profile._json.followers_count
      user.following = profile._json.friends_count
      user.photo = getFullProfilePicURL(profile._json.profile_image_url)
      user.displayName = profile._json.name
      user.save(function (err) {
        if (err) {
          console.log('Error occuring while updating user', err)
        } else {
          console.log('User successfully updated')
        }
        user.appToken = generateJWT(user._id)
        return cb(null, user)
      })
    } else {
      let newUser = new User({
        _id: profile._json.screen_name,
        twitterAccessToken: token,
        twitterAccessTokenSecret: tokenSecret,
        followers: profile._json.followers_count,
        following: profile._json.friends_count,
        photo: getFullProfilePicURL(profile._json.profile_image_url),
        displayName: profile._json.name
      })
      newUser.save(function (err) {
        if (err) {
          console.log('Error occuring while adding new user', err)
        } else {
          console.log('User successfully added to DB')
        }
        newUser.appToken = generateJWT(newUser._id)
        return cb(null, newUser)
      })
    }
  })
})

export default authTwitter
