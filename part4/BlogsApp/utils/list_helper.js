const dummy = (blogs) => {
  return 1
}

/**
 * Calculate the total ammount of blogs that an array of blogs has
 *
 * @param {[{title: String, author: String, url:String, likes: Number, id: String}]} blogs llista de blogs dels quals calcular likes
 * @returns {Number}
 */
const totalLikes = (blogs) => {
  /**
   *  reduce callback function to calculate the total likes of a blog Array
   *
   * @param {Number} sum
   * @param {Object} blog
   * @returns {Number}
   */

  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.length === 0?
    0
    :
    blogs.reduce(reducer,0)

}

/**
 *
 * @param {Array} blogs blogs a tenir en compte
 */
const favouriteBlog = (blogs) => {
  const favReducer = (fav, blog) => {
    return blog.likes > fav.likes ? blog : fav
  }

  return blogs.length === 0 ? null : blogs.reduce(favReducer, blogs[0])
}

/**
 *
 * @param {Array} blogs
 * @returns {Object}
 */
const mostLikes = (blogs) => {
  /**
   *
   * @param {Array} authList
   * @param {Object} blog
   * @returns {Array}
   */
  const authReducer = (authList, blog) => {
    if (authList.map(a => a.author).includes(blog.author)){
      return authList.map(a => a.author === blog.author ? { ...a, likes :a.likes +blog.likes } : a)
    }
    else{
      return authList.concat({ author: blog.author, likes: blog.likes })
    }
  }

  const maxAuthReducer = (maxAuth, auth) => {
    return auth.likes > maxAuth.likes ? auth : maxAuth
  }
  const authors = blogs.reduce(authReducer, [])

  return blogs.length === 0 ? null : authors.reduce(maxAuthReducer, authors[0])
}

const mostBlogs = (blogs) => {
  const authReducer = (authList, blog) => {
    if (authList.map(a => a.author).includes(blog.author)){
      return authList.map(a => a.author === blog.author ? { ...a, blogs :a.blogs +1 } : a)
    }
    else{
      return authList.concat({ author: blog.author, blogs: 1 })
    }
  }

  const maxAuthReducer = (maxAuth, auth) => {
    return auth.blogs > maxAuth.blogs ? auth : maxAuth
  }
  const authors = blogs.reduce(authReducer, [])

  return blogs.length === 0 ? null : authors.reduce(maxAuthReducer, authors[0])
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostLikes,
  mostBlogs
}