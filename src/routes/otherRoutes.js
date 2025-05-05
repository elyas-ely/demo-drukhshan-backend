import { Hono } from 'hono'
import {
  getAllBanners,
  getAllNotifications,
} from '../controllers/otherController.js'

const router = new Hono()

// =======================================
// ============== GET ROUTES =============
// =======================================
router.get('/banners', getAllBanners)
router.get('/notifications', getAllNotifications)

export default router
