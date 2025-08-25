const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const initalBlogs = [
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

beforeEach(async() => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initalBlogs[0])
  await blogObject.save()
  blogObject = Blog(initalBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
test.only('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initalBlogs.length)
})

test.only('the first blog is about HTTP methods', async () => {
  const response = await api.get('/api/blogs')

  const contents = response.body.map(e => e.title)
  assert(contents.includes('HTML is easy'))
})
after(async () => {
  await mongoose.connection.close()
})