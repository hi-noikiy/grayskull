import db from '@data/context'
import withCss from '@zeit/next-css'
import withSass from '@zeit/next-sass'
import bodyParser from 'body-parser'
import express from 'express'
import next from 'next'
import pathMatch from 'path-match'
import LoginController from './api/controllers/loginController'
import UserController from './api/controllers/userController'
import ClientService from './api/services/ClientService'
import UserAccountService from './api/services/UserAccountService'
import ConfigurationManager from './config/ConfigurationManager'

const clients = require(ConfigurationManager.General.clientsFilePath)

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, dir: './public', conf: withSass(withCss()) })
const handle = app.getRequestHandler()

// const apiRoutes = require('./server/routes/apiRoutes.js');

app.prepare().then(() => {
  const server = express()

  server.use(bodyParser.urlencoded())
  // server.use('/api', apiRoutes);

  // Server-side
  const route = pathMatch()

  const routeControllers = [new LoginController(app), new UserController(app)]
  routeControllers.forEach((c) => c.registerRoutes(server))

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  // console.log('Initializing database connection')
  db.sequelize
    .sync()
    .then(ensureClients)
    .then(ensureAdmin)
    .then(() => {
      /* eslint-disable no-console */
      server.listen(3000, (err) => {
        if (err) {
          throw err
        }
        console.log('Server ready on http://localhost:3000')
      })
    })
    .catch((err) => {
      console.error(err)
    })
})

function ensureClients(): Promise<any> {
  return Promise.all(
    clients.map((c) => {
      return ClientService.getClientByclientId(c.clientId).then((client) => {
        if (client) {
          return ClientService.updateClientByclientId(c, c.clientId)
        } else {
          return ClientService.createClient(c)
        }
      })
    })
  )
}

async function ensureAdmin(): Promise<any> {
  const user = await UserAccountService.getUserAccountByemailAddress(ConfigurationManager.Security.adminEmailAddress)
  if (!user) {
    // We use clientId -1 as admin
    UserAccountService.inviteAdmin()
  }
}
