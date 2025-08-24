<template>
  <v-container>
    <v-card-title>Rolle verwalten </v-card-title>
    <v-card>
      <v-data-table :headers="headers" :items="roleWithPermissions" item-key="id">
        <template #[`item.permissions`]="{ item }">
          <v-select
            :model-value="item.permissionIds"
            :items="permissions"
            item-title="name"
            item-value="id"
            multiple
            chips
            hide-details
            density="comfortable"
            @update:model-value="(val) => updatePermissionRoles(item, val)"
            :loading="loadingByRole[item.id] === true"
          />
        </template>
      </v-data-table>
    </v-card>
    <!-- Snackbar für Erfolg/Error -->
    <v-snackbar v-model="snackbar.open" :timeout="3000" :color="snackbar.color">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  assignRolePermissions,
  getAllPermissions,
  getAllRoles,
  getRolePermissions,
} from '@/api/index.js'
import { notify } from '@/utils/notify'

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Rolle', key: 'name' },
  { title: 'Rechte', key: 'permissions' },
]

const roles = ref([])
const permissions = ref([])
const rolePermissionsByRole = ref({}) // z.B. { 1: [1,2], 2: [3] }
const loadingByRole = ref({}) // { [roleId]: true | false }
const snackbar = ref({ open: false, text: '', color: 'success' })

// Daten laden
onMounted(async () => {
  const [rolesRes, permissionsRes, rolePermissionsRes] = await Promise.all([
    getAllRoles(), // [{ "id": 1, "name": "admin" }]
    getAllPermissions(), // [{"id": 6, "name": "role_delete"}]
    getRolePermissions(), // [{"roleid": 1,"permissionid": 1}]
  ])
  roles.value = rolesRes.data
  permissions.value = permissionsRes.data.map((i) => ({
    id: i.id,
    name: mapPermissionName(i.name),
  }))
  const grouped = {}
  rolePermissionsRes.data.forEach(({ roleid, permissionid }) => {
    if (!grouped[roleid]) grouped[roleid] = []
    grouped[roleid].push(permissionid)
  })
  rolePermissionsByRole.value = grouped
})

const roleWithPermissions = computed(() => {
  return roles.value.map((role) => ({
    ...role,
    permissionIds: rolePermissionsByRole.value[role.id] || [],
  }))
})

async function updatePermissionRoles(role, newIds) {
  if (newIds.length === 0) {
    notify(snackbar, 'Eine Rolle benötigt mindestens eine Berechtigung', 'error')
    return
  }
  const roleId = role.id
  try {
    // Loading an
    loadingByRole.value = { ...loadingByRole.value, [roleId]: true }
    // PUT an Server – wir ändern lokal noch NICHTS
    await assignRolePermissions({
      roleId: role.id,
      permissionIds: newIds,
    })
    // Erst jetzt: lokale Quelle aktualisieren → Table/Select zieht automatisch nach
    rolePermissionsByRole.value = {
      ...rolePermissionsByRole.value,
      [roleId]: newIds,
    }
    notify(snackbar, `Rechte für "${role.name}" gespeichert`, 'success')
  } catch (err) {
    notify(snackbar, 'Fehler beim Speichern der Rechte', 'error')
  } finally {
    // Loading aus
    loadingByRole.value = { ...loadingByRole.value, [roleId]: false }
  }
}

const mapPermissionName = (rawName) => {
  switch (rawName) {
    case 'user_read':
      return 'Benutzer lesen'
    case 'user_create':
      return 'Benutzer anlegen'
    case 'user_delete':
      return 'Benutzer löschen'
    case 'role_read':
      return 'Rolle lesen'
    case 'role_create':
      return 'Rolle anlegen'
    case 'role_delete':
      return 'Rolle löschen'
    default:
      return rawName?.replaceAll('_', ' ') || ''
  }
}
</script>
