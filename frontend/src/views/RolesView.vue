<template>
  <v-container>
    <v-card-title>Rolle verwalten</v-card-title>
    <v-card>
      <v-card-text>
        <v-data-table :headers="headers" :items="roleWithPermissions" item-key="id">
          <template #[`item.permissions`]="{ item }">
            <v-select
              :model-value="item.permissionIds"
              :items="permissions"
              item-title="name"
              item-value="id"
              multiple
              chips
              density="comfortable"
              @update:model-value="(val) => updatePermissionRoles(item, val)"
              :loading="loadingByRole[item.id] === true"
            ></v-select>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <!-- Snackbar für Erfolg/Error -->
    <v-snackbar v-model="snackbar.open" :timeout="3000" :color="snackbar.color">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'

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
    axios.get('http://localhost:8888/api/roles'), // [{ "id": 1, "name": "admin" }]
    axios.get('http://localhost:8888/api/permissions'), // [{"id": 6, "name": "role_delete"}]
    axios.get('http://localhost:8888/api/assign/role-permissions'), // [{"roleid": 1,"permissionid": 1}]
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
    notify('Eine Rolle benötigt mindestens eine Berechtigung', 'error')
    return
  }
  const roleId = role.id
  try {
    // Loading an
    loadingByRole.value = { ...loadingByRole.value, [roleId]: true }
    // PUT an Server – wir ändern lokal noch NICHTS
    await axios.put('http://localhost:8888/api/assign/role-permissions', {
      roleId: role.id,
      permissionIds: newIds,
    })
    // Erst jetzt: lokale Quelle aktualisieren → Table/Select zieht automatisch nach
    rolePermissionsByRole.value = {
      ...rolePermissionsByRole.value,
      [roleId]: newIds,
    }
    notify(`Rechte für "${role.name}" gespeichert`, 'success')
  } catch (err) {
    notify('Fehler beim Speichern der Rechte', 'error')
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

function notify(text, color = 'success') {
  snackbar.value = { open: true, text, color }
}
</script>
