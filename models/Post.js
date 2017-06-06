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

export default mongoose.model('Post', postSchema)
