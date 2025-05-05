import { Hono } from 'hono'
import {
  getAllPosts,
  getSearchPosts,
  getPostById,
  getPostsByUserId,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  commentPost,
  uncommentPost
} from '../controllers/postController.js'

const router = new Hono()

// =======================================
// ============== GET ROUTES =============
// =======================================
router.get('/', getAllPosts)
router.get('/search', getSearchPosts)
router.get('/:postId', getPostById)
router.get('/user/:userId', getPostsByUserId)

// =======================================
// ============== POST ROUTES ============
// =======================================
router.post('/', createPost)
router.post('/:postId/like', likePost)
router.post('/:postId/comment', commentPost)

// =======================================
// ============== PUT ROUTES =============
// =======================================
router.put('/:postId', updatePost)

// =======================================
// ============== DELETE ROUTES ==========
// =======================================
router.delete('/:postId', deletePost)
router.delete('/:postId/like', unlikePost)
router.delete('/:postId/comment/:commentId', uncommentPost)

export default router
