const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogList = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]
const singleBlogList = [{
  title:'blog de prova',
  author:'jo mateix',
  url:'https://example.com',
  likes: 3,
  id: '6891ba921f35d90b31351735'
}]
test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes',() => {
  test('total likes of a empty list', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })

  test('total likes of a single element', () => {
    assert.strictEqual(listHelper.totalLikes(singleBlogList), 3)
  })

  test('an array of blogs', () => {

    assert.strictEqual(listHelper.totalLikes(blogList), 36)
  })
})

describe('favourite blog', () => {
  test('of empty list', () => {
    assert.deepStrictEqual(listHelper.favouriteBlog([]), null)
  })

  test('of single blog list', () => {
    assert.deepStrictEqual(listHelper.favouriteBlog(singleBlogList), singleBlogList[0])
  })

  test('of a full list', () => {
    assert.deepStrictEqual(listHelper.favouriteBlog(blogList), blogList[2])
  })

})

describe('favourite author', () => {
  test('of empty list', () => {
    assert.deepStrictEqual(listHelper.mostLikes([]), null)
  })

  test('of single blog', () => {
    assert.deepStrictEqual(listHelper.mostLikes(singleBlogList), { author: 'jo mateix', likes: 3 })
  })

  test('of a full list of blogs', () => {
    assert.deepStrictEqual(listHelper.mostLikes(blogList), { author: 'Edsger W. Dijkstra', likes: 17 })
  })

})

describe('most repeated author', () => {
  test('empty list', () => {
    assert.deepStrictEqual(listHelper.mostBlogs([]),null)
  })

  test('single blog', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(singleBlogList), { author: 'jo mateix', blogs: 1 })
  })

  test('multiple blog list', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(blogList), { author: 'Robert C. Martin', blogs: 3 })
  })
})
