const Blog = require('../models/blog')

const falseId = '68ad8a9159761065f9506dd1'

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'Joan',
    url: 'www.exemple.com',
    likes: 2
  },
  {
    title: 'Browser can execute only JavaScript',
    author: 'chatgpt',
    url: 'www.joanrates.com',
    likes: 10
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author:'y', likes:0 })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, falseId
}