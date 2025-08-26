const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog)
    response.json(blog)
  else{
    response.status(404).json({ error: 'no blog with this id found' })
  }

})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()

})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const result = await blog.save()
  response.status(201).json(result)

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
