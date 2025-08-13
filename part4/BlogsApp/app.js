
const config = require('./utils/config')
const express = require('express')
const blogsRouter = require('./controllers/blogs')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

const mongoUrl = config.MONGO_URI
logger.info('connecting to Mongo...')
mongoose.connect(mongoUrl)
  .then(response => {
    logger.info('connected to Mongo')
  })
  .catch(error => {
    logger.error('error connecting to MongoDB:',error.message)
  })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/blogs', blogsRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app