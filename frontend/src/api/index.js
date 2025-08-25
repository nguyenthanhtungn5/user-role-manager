import axios from 'axios'

export const api = axios.create({
  baseURL:
    import.meta?.env?.VITE_API_BASE || process.env.VUE_APP_API_BASE || 'http://localhost:8888',
})

export function getAllUsers() {
  return api.get('/api/users')
}

export function createAUser({ firstName, lastName, email, phone }) {
  return api.post('/api/users', { firstName, lastName, email, phone })
}

export function deleteAUser(id) {
  return api.delete(`/api/users/${id}`)
}

export function getAllRoles() {
  return api.get('/api/roles')
}

export function getUserRoles() {
  return api.get('/api/assign/user-roles')
}

export function createARole({ name }) {
  return api.post('/api/roles', { name })
}

export function assignUserRoles({ userId, roleIds }) {
  return api.put('/api/assign/user-roles', { userId, roleIds })
}

export function getAllPermissions() {
  return api.get('/api/permissions')
}

export function getRolePermissions() {
  return api.get('/api/assign/role-permissions')
}

export function assignRolePermissions({ roleId, permissionIds }) {
  return api.put('/api/assign/role-permissions', { roleId, permissionIds })
}
