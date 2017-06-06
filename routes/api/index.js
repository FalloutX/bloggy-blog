import express from 'express'
import posts from './posts'
import profile from './profile'


const router = express.Router()

posts(router)
profile(router)

export default router
