const Blog = require('../models/blog')
const User = require('../models/user')




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

const falseId = nonExistingId()

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}


module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}