import {
  getAllPostsFn,
  getPostByIdFn,
  getPostsByUserIdFn,
  createPostFn,
  updatePostFn,
  deletePostFn,
  getSearchPostsFn,
  getPopularPostsFn,
  updateLikeFn,
  updateSaveFn,
  getSavedPostFn,
  getViewedPostFn,
  getFilteredPostFn,
  updateViewedPostsFn,
} from '../services/postService.js'
import { logger } from '../utils/logger.js'

// =======================================
// ============== GET ALL POSTS ==========
// =======================================
export const getAllPosts = async (c) => {
  const { userId, page = '1' } = c.req.query()
  const limit = 12
  const offset = (parseInt(page) - 1) * limit

  if (!userId) {
    return c.json({ error: 'User ID is required' }, 400)
  }

  try {
    const posts = await getAllPostsFn(userId, limit, offset)

    return c.json({
      posts,
      nextPage: posts.length < limit ? null : parseInt(page) + 1,
    })
  } catch (err) {
    console.error('Error in getAllPosts:', err)
    return c.json({ error: 'Failed to retrieve posts' }, 500)
  }
}

// =======================================
// ============== GET POPULAR POSTS ==========
// =======================================
export const getPopularPosts = async (c) => {
  const { userId } = c.req.query()

  if (!userId) {
    return c.json({ error: 'User ID is required' }, 400)
  }

  try {
    const posts = await getPopularPostsFn(userId)

    if (posts.length === 0) {
      return c.json({ message: 'No posts found' }, 404)
    }

    return c.json(posts)
  } catch (err) {
    console.error('Error in getPopularPosts:', err)
    return c.json({ error: 'Failed to retrieve posts' }, 500)
  }
}

// =======================================
// ============== GET POST BY ID =========
// =======================================
export const getPostById = async (c) => {
  const { postId } = c.req.param()
  const { userId } = c.req.query()

  if (!postId || !userId) {
    return c.json({ error: 'Post ID and User ID are required' }, 400)
  }

  try {
    const post = await getPostByIdFn(postId, userId)
    if (!post) {
      return c.json({ message: 'Post not found' }, 404)
    }
    return c.json(post)
  } catch (err) {
    console.error('Error in getPostById:', err)
    return c.json({ error: 'Failed to retrieve post' }, 500)
  }
}

// =======================================
// ============== GET SAVED POST =========
// =======================================
export const getSavesPost = async (c) => {
  const { userId } = c.req.param()
  const { page = '1' } = c.req.query()
  const limit = 12
  const offset = (parseInt(page) - 1) * limit

  if (!userId) {
    return c.json({ error: 'User ID is required' }, 400)
  }

  try {
    const posts = await getSavedPostFn(userId, limit, offset)

    return c.json({
      posts,
      nextPage: posts.length < limit ? null : parseInt(page) + 1,
    })
  } catch (err) {
    console.error('Error in getSavesPost:', err)
    return c.json({ error: 'Failed to retrieve saved posts' }, 500)
  }
}

// =======================================
// ============== GET VIEWED POST =========
// =======================================
export const getViewedPost = async (c) => {
  const { userId } = c.req.param()

  if (!userId) {
    return c.json({ error: 'User ID is required' }, 400)
  }

  try {
    const post = await getViewedPostFn(userId)
    if (!post) {
      return c.json({ message: 'Post not found' }, 404)
    }
    return c.json(post)
  } catch (err) {
    console.error('Error in getViewedPost:', err)
    return c.json({ error: 'Failed to retrieve post' }, 500)
  }
}

// =======================================
// ============= GET SEARCH POSTS ========
// =======================================
export const getSearchPosts = async (c) => {
  const { searchTerm } = c.req.query()
  try {
    const posts = await getSearchPostsFn(searchTerm)
    if (posts.length === 0) {
      return c.json({ message: 'No posts found' }, 404)
    }
    return c.json(posts)
  } catch (err) {
    console.error('Error in getSearchPosts:', err)
    return c.json({ error: 'Failed to retrieve posts' }, 500)
  }
}

// =======================================
// ========= GET POSTS BY USER ID ========
// =======================================
export const getPostsByUserId = async (c) => {
  const { userId } = c.req.param()
  const { myId, page = '1' } = c.req.query()
  const limit = 12
  const offset = (parseInt(page) - 1) * limit

  if (!userId || !myId) {
    return c.json({ error: 'User ID is required' }, 400)
  }

  try {
    const posts = await getPostsByUserIdFn(userId, myId, limit, offset)
    if (posts.length === 0) {
      return c.json({ message: 'No posts found for this user' }, 404)
    }
    return c.json({
      posts,
      nextPage: posts.length < limit ? null : parseInt(page) + 1,
    })
  } catch (err) {
    console.error('Error in getPostsByUserId:', err)
    return c.json({ error: 'Failed to retrieve posts' }, 500)
  }
}

// =======================================
// ========= GET POSTS BY USER ID ========
// =======================================
export const getFilteredPost = async (c) => {
  const { userId, page = '1' } = c.req.query()
  const filters = c.req.query()
  const limit = 12
  const offset = (parseInt(page) - 1) * limit

  if (!filters?.car_name || !userId) {
    return c.json(
      { error: 'User ID and car name are required (getFilteredPost) ' },
      400
    )
  }

  try {
    const posts = await getFilteredPostFn(filters, userId, limit, offset)

    return c.json({
      posts,
      nextPage: posts.length < limit ? null : parseInt(page) + 1,
    })
  } catch (err) {
    console.error('Error in getFilteredPost:', err)
    return c.json({ error: 'Failed to retrieve filtered posts' }, 500)
  }
}

// =======================================
// ============== CREATE POST ============
// =======================================
export const createPost = async (c) => {
  const postData = await c.req.json()
  try {
    const newPost = await createPostFn(postData)
    if (!newPost) {
      return c.json({ error: 'Failed to create post' }, 400)
    }
    return c.json({ message: 'new post created' }, 201)
  } catch (error) {
    logger.error('Error in createPost:', error)
    return c.json({ error: 'Failed to create post' }, 500)
  }
}

// =======================================
// ============== UPDATE POST ============
// =======================================
export const updatePost = async (c) => {
  const { postId } = c.req.param()
  const updateData = await c.req.json()

  if (!postId) {
    return c.json({ error: 'Post ID is required' }, 400)
  }

  try {
    const updatedPost = await updatePostFn(postId, updateData)
    if (!updatedPost) {
      return c.json({ message: 'Post not found' }, 404)
    }
    return c.json(updatedPost)
  } catch (error) {
    logger.error('Error in updatePost:', error)
    return c.json({ error: 'Failed to update post' }, 500)
  }
}

// =======================================
// ============== UPDATE SAVE POST =======
// =======================================
export const updateSave = async (c) => {
  const { userId } = c.req.query()
  const { postId } = c.req.param()

  if (!userId || !postId) {
    return c.json({ error: 'Post ID and User ID are required' }, 400)
  }

  try {
    const post = await updateSaveFn(userId, postId)
    if (!post) {
      return c.json({ message: 'Post not found' }, 404)
    }
    return c.json({ message: 'post save updated successfully' })
  } catch (err) {
    console.error('Error in updateSave:', err)
    return c.json({ error: 'Failed to update post save' }, 500)
  }
}

// =======================================
// ============== UPDATE LIKE POST =======
// =======================================
export const updateLike = async (c) => {
  const { userId } = c.req.query()
  const { postId } = c.req.param()

  if (!userId || !postId) {
    return c.json({ error: 'Post ID and User ID are required' }, 400)
  }

  try {
    const post = await updateLikeFn(userId, postId)
    if (!post) {
      return c.json({ message: 'Post not found' }, 404)
    }
    return c.json({ message: 'post like updated successfully' })
  } catch (err) {
    console.error('Error in updateLike:', err)
    return c.json({ error: 'Failed to update post like' }, 500)
  }
}

// =======================================
// ============== UPDATE VIEWED POST =======
// =======================================
export const updateViewedPosts = async (c) => {
  const { userId } = c.req.query()
  const { postId } = c.req.param()

  if (!userId || !postId) {
    return c.json({ error: 'Post ID and User ID are required' }, 400)
  }

  try {
    const post = await updateViewedPostsFn(userId, postId)
    if (!post) {
      return c.json({ message: 'Post not found' }, 404)
    }
    return c.json({ message: 'post viewed updated successfully' })
  } catch (err) {
    console.error('Error in updateViewedPosts:', err)
    return c.json({ error: 'Failed to update post viewed' }, 500)
  }
}

// =======================================
// ============== DELETE POST ============
// =======================================
export const deletePost = async (c) => {
  const { postId } = c.req.param()
  const { userId } = c.req.query()

  if (!postId || !userId) {
    return c.json({ error: 'Post ID and User ID are required' }, 400)
  }

  try {
    const result = await deletePostFn(postId)
    if (!result) {
      return c.json({ message: 'Post not found' }, 404)
    }
    return c.json({ message: 'Post deleted successfully' })
  } catch (err) {
    console.error('Error in deletePost:', err)
    return c.json({ error: 'Failed to delete post' }, 500)
  }
}
