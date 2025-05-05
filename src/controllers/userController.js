import {
  getAllUsersFn,
  getUserByIdFn,
  getViewedUsersFn,
  updateUserFn,
  createUserFn,
  deleteUserFn,
  updateViewedUsersFn,
  getSearchUsersFn,
} from '../services/userService.js'
import { logger } from '../utils/logger.js'

// =======================================
// ============= GET ALL USERS ===========
// =======================================
const getAllUsers = async (c) => {
  const { searchTerm = '', city = '', page = '1' } = c.req.query()
  const limit = 15
  const offset = (parseInt(page) - 1) * limit

  if (!searchTerm) {
    return c.json({ error: 'Search term is required' }, 400)
  }

  try {
    const users = await getAllUsersFn(searchTerm, city, limit, offset)

    return c.json({
      users,
      nextPage: users.length === limit ? parseInt(page) + 1 : null,
    })
  } catch (err) {
    console.error('Error in getAllUsers:', err)
    return c.json({ error: 'Failed to retrieve users' }, 500)
  }
}

// =======================================
// ============= GET SEARCH USERS ===========
// =======================================
const getSearchUsers = async (c) => {
  const { searchTerm } = c.req.query()

  if (!searchTerm) {
    return c.json({ error: 'Search term is required' }, 400)
  }

  try {
    const users = await getSearchUsersFn(searchTerm)
    if (users.length === 0) {
      return c.json({ message: 'No users found' }, 404)
    }
    return c.json(users)
  } catch (err) {
    console.error('Error in getSearchUsers:', err)
    return c.json({ error: 'Failed to retrieve users' }, 500)
  }
}

// =======================================
// ============ GET USER BY ID ===========
// =======================================
const getUserById = async (c) => {
  const { userId } = c.req.param()

  if (!userId) {
    return c.json({ error: 'User ID is required' }, 400)
  }

  try {
    const user = await getUserByIdFn(userId)
    if (!user) {
      return c.json({ message: 'User not found' }, 404)
    }
    return c.json(user)
  } catch (err) {
    console.error('Error in getUserById:', err)
    return c.json({ error: 'Failed to retrieve user' }, 500)
  }
}

// =======================================
// ============ GET VIEWED USERS ===========
// =======================================
const getViewedUsers = async (c) => {
  const { userId } = c.req.param()

  if (!userId) {
    return c.json({ error: 'User ID is required' }, 400)
  }

  try {
    const users = await getViewedUsersFn(userId)
    if (!users.length) {
      return c.json({ message: 'No viewed users found' }, 404)
    }
    return c.json(users)
  } catch (err) {
    console.error('Error in getViewedUsers:', err)
    return c.json({ error: 'Failed to retrieve viewed users' }, 500)
  }
}

// =======================================
// ============= CREATE USER =============
// =======================================
const createUser = async (c) => {
  const userData = await c.req.json()
  try {
    const newUser = await createUserFn(userData)
    return c.json(newUser, 201)
  } catch (err) {
    console.error('Error in createUser:', err)
    return c.json({ error: 'Failed to create user' }, 500)
  }
}

// =======================================
// ============= UPDATE USER =============
// =======================================
const updateUser = async (c) => {
  const { userId } = c.req.param()
  const userData = await c.req.json()

  if (!userId) {
    return c.json({ error: 'User ID is required' }, 400)
  }

  try {
    const updatedUser = await updateUserFn(userId, userData)
    if (!updatedUser) {
      return c.json({ message: 'User not found' }, 404)
    }
    return c.json(updatedUser)
  } catch (err) {
    console.error('Error in updateUser:', err)
    return c.json({ error: 'Failed to update user' }, 500)
  }
}

// =======================================
// ============== UPDATE VIEWED USERS =======
// =======================================
const updateViewedUsers = async (c) => {
  const { otherId } = c.req.param()
  const { userId } = await c.req.json()

  if (!userId || !otherId) {
    return c.json({ error: 'User ID and Other ID are required' }, 400)
  }

  try {
    const result = await updateViewedUsersFn(userId, otherId)
    if (!result) {
      return c.json({ message: 'Failed to update viewed users' }, 400)
    }
    return c.json({ message: 'Viewed users updated successfully' })
  } catch (err) {
    console.error('Error in updateViewedUsers:', err)
    return c.json({ error: 'Failed to update viewed users' }, 500)
  }
}

// =======================================
// ============= DELETE USER =============
// =======================================
const deleteUser = async (c) => {
  const { userId } = c.req.param()

  if (!userId) {
    return c.json({ error: 'User ID is required' }, 400)
  }

  try {
    const result = await deleteUserFn(userId)
    if (!result) {
      return c.json({ message: 'User not found' }, 404)
    }
    return c.json({ message: 'User deleted successfully' })
  } catch (err) {
    console.error('Error in deleteUser:', err)
    return c.json({ error: 'Failed to delete user' }, 500)
  }
}

export {
  getAllUsers,
  getSearchUsers,
  getUserById,
  getViewedUsers,
  createUser,
  updateUser,
  deleteUser,
  updateViewedUsers,
}
