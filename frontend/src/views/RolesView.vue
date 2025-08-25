<style scoped>
.custom-dialog-overlay {
  backdrop-filter: blur(8px);
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
<template>
  <v-container>
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h4">Rolle verwalten</span>
      <v-btn
        @click="showAddRoleDialog = true"
        color="primary"
        class="text-body-2 px-4"
        elevation="3"
        >Neue Rolle anlegen</v-btn
      ></v-card-title
    >
    <v-card>
      <v-data-table
        :headers="headers"
        :items="roleWithPermissions"
        item-key="id"
        :items-per-page="5"
        :items-per-page-options="[5, 10, 20, 50]"
      >
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
        <template #[`item.action`]="{ item }">
          <div class="d-flex justify-center align-center" style="height: 100%; gap: 8px">
            <v-tooltip text="Rolle löschen" location="bottom">
              <template #activator="{ props }">
                <v-icon
                  v-bind="props"
                  icon
                  color="error"
                  style="cursor: pointer"
                  @click="deleteRole(item)"
                  >mdi-delete-outline</v-icon
                >
              </template>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </v-card>
    <!-- Snackbar für Erfolg/Error -->
    <v-snackbar v-model="snackbar.open" :timeout="3000" :color="snackbar.color">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
  <v-dialog
    v-model="showAddRoleDialog"
    max-width="600px"
    min-width="500px"
    overlay-class="custom-dialog-overlay"
  >
    <v-card class="px-4 py-4">
      <v-card-title class="text-h6">Neue Rolle anlegen</v-card-title>
      <v-card-text>
        <v-form ref="addRoleForm" @submit.prevent="submitAddRole">
          <v-text-field v-model="newRole.name" label="Name" required />
          <v-select
            v-model="newRole.permissionIds"
            :items="permissions"
            item-title="name"
            item-value="id"
            label="Rechte"
            multiple
            chips
            required
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          class="text-body-2 px-4 mr-2"
          elevation="1"
          @click="showAddRoleDialog = false"
          style="background-color: #f44336; color: white"
        >
          Abbrechen
        </v-btn>
        <v-btn
          class="text-body-2 px-4"
          elevation="1"
          @click="submitAddRole"
          style="background-color: #1867c0; color: white"
          :loading="loadingCreateRole"
        >
          Speichern
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  assignRolePermissions,
  getAllPermissions,
  createARole,
  getRolePermissions,
  getAllRoles,
  deleteARole,
} from '@/api/index.js'
import { notify } from '@/utils/notify'

const headers = [
  { title: 'Rolle', key: 'name', minWidth: '10em' },
  { title: 'Rechte', key: 'permissions', minWidth: '20em' },
  { title: 'Aktionen', key: 'action', sortable: false, minWidth: '5em' },
]

const roles = ref([])
const permissions = ref([])
const rolePermissionsByRole = ref({}) // z.B. { 1: [1,2], 2: [3] }
const loadingByRole = ref({}) // { [roleId]: true | false }
const snackbar = ref({ open: false, text: '', color: 'success' })

// Modal
const showAddRoleDialog = ref(null)
const newRole = ref({ name: '', permissionIds: [] })
const loadingCreateRole = ref(null)

// Daten laden
onMounted(async () => {
  await loadRoles()
})

async function loadRoles() {
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
}

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

async function submitAddRole() {
  const role = newRole.value
  if (!role.name?.trim()) {
    alert('Bitte ein Name eingeben')
    return
  }
  loadingCreateRole.value = true
  try {
    const res = await createARole({
      name: role.name,
    })
    if (res.status === 201 && res.data?.id && role.permissionIds.length > 0) {
      notify(snackbar, 'Rolle erfolgreich angelegt', 'success')
    } else {
      notify(snackbar, 'Fehler beim Anlegen der Rolle', 'error')
    }
    notify(snackbar, 'Rolle erfolgreich angelegt', 'success')
  } catch (err) {
    notify(snackbar, 'Fehler beim Anlegen der Rolle', 'error')
  } finally {
    // Dialog schließen & Formular resetten
    resetAddRoleForm()
    showAddRoleDialog.value = false
    loadingCreateRole.value = false
  }
  await loadRoles()
}

async function deleteRole(item) {
  try {
    await deleteARole(item.id)
    notify(snackbar, `Rolle ${item.name} erfolgreich gelöscht`, 'success')
  } catch (err) {
    notify(snackbar, 'Fehler beim Löschen der Rolle ${item.name}', 'error')
  }
  await loadRoles()
}

function resetAddRoleForm() {
  newRole.value = {
    name: '',
    permissionIds: [],
  }
}
</script>
