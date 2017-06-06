import loginRoutes from './login'
import apiRoutes from './api'

export default function routes (app) {
  app.use('/login', loginRoutes)
  app.use('/api', apiRoutes)
}
