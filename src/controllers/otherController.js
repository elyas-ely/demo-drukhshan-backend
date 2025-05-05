import {
  getAllBannersFn,
  getAllNotificationsFn,
} from '../services/otherService.js'

// =======================================
// ============== GET ALL BANNERS =======
// =======================================
const getAllBanners = async (c) => {
  try {
    const banners = await getAllBannersFn()
    if (!banners) {
      return c.json({ message: 'banners not found' }, 404)
    }
    return c.json(banners)
  } catch (err) {
    console.error('Error in getAllBanners:', err)
    return c.json({ error: 'Failed to retrieve banners' }, 500)
  }
}

// =======================================
// ============== GET ALL NOTIFICATIONS =======
// =======================================
const getAllNotifications = async (c) => {
  try {
    const notifications = await getAllNotificationsFn()
    if (!notifications) {
      return c.json({ message: 'notifications not found' }, 404)
    }
    return c.json(notifications)
  } catch (err) {
    console.error('Error in getAllNotifications:', err)
    return c.json({ error: 'Failed to retrieve notifications' }, 500)
  }
}

export { getAllBanners, getAllNotifications }
