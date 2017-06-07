import mongoose from 'mongoose'
const Schema = mongoose.Schema

const postSchema = new Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  likes: [{type: String, ref: 'User', required: true}],
  views: [{type: String, ref: 'User', required: true}],
  authorId: {type: String, ref: 'User', required: true},
  created_at: {type: Number, required: true},
  last_modified_at: {type: Number, required: true}
})

postSchema.methods.isAuthor = function (user) {
  return this.authorId === user._id
}
postSchema.methods.updateData = function (data) {
  this.title = data.title || this.title
  this.content = data.content || this.content
  this.last_modified_at = data.last_modified_at || this.last_modified_at
}

postSchema.methods.addLike = function (user) {
  if (this.likes.indexOf(user._id) === -1) {
    this.likes.push(user._id)
  }
}

postSchema.methods.addView = function (user) {
  if (this.views.indexOf(user._id) !== -1) {
    this.views.push(user._id)
  }
}

export default mongoose.model('Post', postSchema)
