const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name:1})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', {username: 1, name:1})
  if (blog)
    response.json(blog)
  else{
    response.status(404).json({ error: 'no blog with this id found' })
  }

})


blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog){
    return response.status(204).end()
  }
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({
      error: 'token invalid'
    })
  }
  if (blog.user.toString() !== decodedToken.id){
    return response.status(401).json({
      error: 'not the blog owner'
    })
  }
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()

})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({
      error: 'token invalid'
    })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    likes: body.likes,
    url: body.url,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog)
  await user.save()

  response.status(201).json(savedBlog)

})

blogsRouter.put('/:id', async (request, response) => {
  const updated = await Blog.findByIdAndUpdate(request.params.id, request.body)
  if (updated)
    response.status(204).end()
  else {
    response.status(400).json({ error: 'no blog with that id' })
  }
})

module.exports = blogsRouter
