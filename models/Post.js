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

export default mongoose.model('Post', postSchema)
