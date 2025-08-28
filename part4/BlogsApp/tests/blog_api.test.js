const { test, after, beforeEach, describe, before } = require('node:test')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)

let tester
let token


describe('when there is initially some blogs saved', () => {
  before(async() => {
    await User.deleteMany({})
    const userObject = new User(helper.initialUser)
    tester = (await userObject.save()).toJSON()
    token = jwt.sign({username: tester.username, id:tester.id}, process.env.SECRET)
  })
  beforeEach(async() => {
    await Blog.deleteMany({})
    
    const blogObjects = helper.initialBlogs.map(blog => new Blog({... blog, user: tester.id}))
    promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('there are initial blogs', async () => {
    const response = await helper.blogsInDb()
    assert.strictEqual(response.length, helper.initialBlogs.length)
  })
  test('api get and tester db objects are the same', async() => {
    const apires = await api.get('/api/blogs')
    const tesres = await helper.blogsInDb()

    assert.deepStrictEqual(apires.body, tesres)
  })

  test('id unique property', async () => {
    const dbContents = await helper.blogsInDb()
    const wrongIds = dbContents.filter(blog => blog.id === null || blog._id)
    assert.strictEqual(wrongIds.length, 0)
  })

  test('the first blog is about HTTP methods', async () => {
    const response = await helper.blogsInDb()
    const contents = response.map(e => e.title)
    assert(contents.includes('HTML is easy'))
  })

  describe('adding blogs', () => {
    test('a valid blog can be added', async() => {
      const newBlog = {
        title: 'async/await simplifies making async calls',
        author: 'Not joan',
        url: 'www.exemple2.com',
        likes: 40
      }
      await api
        .post('/api/blogs')
        .auth(token, {type: 'bearer'})
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await helper.blogsInDb()

      const titles = response.map(r => r.title)

      assert.strictEqual(titles.length, helper.initialBlogs.length +1)
      const createdBlog = response[titles.indexOf(newBlog.title)]
      delete createdBlog.id
      delete createdBlog.user
      assert.deepStrictEqual(createdBlog, newBlog)
    })

    test('blog without title is not added', async () => {
      const noTitleBlog = {
        author: 'Not joan',
        url: 'www.exemple2.com',
        likes: 40
      }

      await api
        .post('/api/blogs')
        .auth(token, {type: 'bearer'})
        .send(noTitleBlog)
        .expect(400)

      const response = await helper.blogsInDb()
      assert.strictEqual(response.length, helper.initialBlogs.length)
    })

    test('blog without author is not added', async() => {
      const noAuthBlog = {
        title: 'Aquest blog no té autor',
        url: 'www.exemple2.com',
        likes: 40
      }

      await api
        .post('/api/blogs')
        .auth(token, {type: 'bearer'})
        .send(noAuthBlog)
        .expect(400)

      const response = await helper.blogsInDb()
      assert.strictEqual(response.length, helper.initialBlogs.length)
    })

    test('blog without likes added as 0', async() => {
      const noLikesBlog = {
        title: 'Aquest blog no té autor',
        author: 'Another Joan',
        url: 'www.exemple2.com'
      }

      await api
        .post('/api/blogs')
        .auth(token, {type: 'bearer'})
        .send(noLikesBlog)
        .expect(201)

      const response = await helper.blogsInDb()
      assert.strictEqual(response.length, helper.initialBlogs.length +1)
      const titles = response.map(blog => blog.title)
      assert(titles.includes(noLikesBlog.title))
      assert.strictEqual(response[titles.indexOf(noLikesBlog.title)].likes, 0)
    })

    test('blog without url is added', async() => {
      const noUrlBlog = {
        title: 'Aquest blog no té url',
        author: 'Another Joan',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .auth(token, {type: 'bearer'})
        .send(noUrlBlog)
        .expect(201)

      const response = await helper.blogsInDb()
      assert.strictEqual(response.length, helper.initialBlogs.length +1)
      const titles = response.map(r => r.title)
      assert(titles.includes(noUrlBlog.title))

    })
  })

  describe('blog viewing', () => {
    test('a specific blog can ve viewed', async() => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]
      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultBlog.body, blogToView)
    })

    test('a non existing blog can not be viewed', async () => {
      const resultBlog = await api
        .get(`/api/blogs/${await helper.nonExistingId()}`)
        .expect(404)

      assert.strictEqual(resultBlog.body.error, 'no blog with this id found')
    })
  })

  describe('blog deleting', () => {
    test('a blog can be deleted', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .auth(token, {type: 'bearer'})
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const titles = blogsAtEnd.map(r => r.title)

      assert(!titles.includes(blogToDelete.title))
    })

    test.only('unexisting blogs are already deleted', async () => {
      const blogsBefore = await helper.blogsInDb()
      await api
        .delete(`/api/blogs/${await helper.nonExistingId()}`)
        .auth(token, {type: 'bearer'})
        .expect(204)
      const blogsAfter = await helper.blogsInDb()
      assert.deepStrictEqual(blogsBefore, blogsAfter)

    })

    test('cannot delet a blog from someone else', async() => {
      const userObject = new User({username: 'someone else', name:' asdf', password: 'asdfasdf'})
      const intruder = (await userObject.save()).toJSON()
      const int_tok = jwt.sign({username: intruder.username, id:intruder.id}, process.env.SECRET)

      const blogsBefore = await helper.blogsInDb()

      await api
        .delete(`/api/blogs/${blogsBefore[0].id}`)
        .auth(int_tok, {type: 'bearer'})
        .expect(401)
      const blogsAfter = await helper.blogsInDb()
      assert.deepStrictEqual(blogsBefore, blogsAfter)
    })
  })

  describe('blog updating', () => {
    test('Update a full blog', async () => {
      const blogId = (await helper.blogsInDb())[0].id
      const updatedBlog = {
        title: 'this blog has been updated',
        author: 'blog updater',
        url:'www.example.hah',
        likes: 3,
        id: blogId
      }
      await api
        .put(`/api/blogs/${blogId}`)
        .send(updatedBlog)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const retBlog = blogsAtEnd.filter(blog => blog.id === blogId)
      assert(retBlog.length === 1)
      assert.deepStrictEqual(retBlog[0], updatedBlog)
    })

    test('Updating a blog with partial info', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogId = blogsAtStart[0].id
      const updatedBlog = {
        author: 'blog updater',
        url:'www.example.hah',
        id: blogId
      }
      await api
        .put(`/api/blogs/${blogId}`)
        .send(updatedBlog)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const retBlog = blogsAtEnd.filter(blog => blog.id === blogId)
      assert(retBlog.length === 1)
      updatedBlog.title = blogsAtStart[0].title
      updatedBlog.likes = blogsAtStart[0].likes
      assert.deepStrictEqual(retBlog[0], updatedBlog)
    })

    test('updating with no valid id', async() => {
      const blogsAtStart = await helper.blogsInDb()
      const blogId = await helper.nonExistingId()
      const updatedBlog = {
        author: 'blog updater',
        url:'www.example.hah',
        id: blogId
      }
      await api
        .put(`/api/blogs/${blogId}`)
        .send(updatedBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      const retBlog = blogsAtEnd.filter(blog => blog.id === blogId)
      assert(retBlog.length === 0)

    })
  })

})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash: passwordHash })

    await user.save()
  })

  test('obtaining real users from db', async () => {
    const users = await helper.usersInDb()
    assert(users.map(u => u.username).includes('root'))
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})