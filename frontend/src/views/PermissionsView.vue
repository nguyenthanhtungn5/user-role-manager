<style scoped>
.custom-dialog-overlay {
  backdrop-filter: blur(8px);
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
<template>
  <v-container>
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h4">Rechte verwalten</span>
      <v-btn
        @click="showAddPermissionDialog = true"
        color="primary"
        class="text-body-2 px-4"
        elevation="3"
        >Neue Rechte anlegen</v-btn
      ></v-card-title
    >
    <v-card>
      <v-data-table
        :headers="headers"
        :items="permissions"
        item-key="id"
        :items-per-page="5"
        :items-per-page-options="[5, 10, 20, 50]"
      >
        <template #[`item.action`]="{ item }">
          <div class="d-flex justify-center align-center" style="height: 100%; gap: 8px">
            <v-tooltip text="Rechte löschen" location="bottom">
              <template #activator="{ props }">
                <v-icon
                  v-bind="props"
                  icon
                  color="error"
                  style="cursor: pointer"
                  @click="deletePermission(item)"
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
    v-model="showAddPermissionDialog"
    max-width="600px"
    min-width="500px"
    overlay-class="custom-dialog-overlay"
  >
    <v-card class="px-4 py-4">
      <v-card-title class="text-h6">Neue Rechte anlegen</v-card-title>
      <v-card-text>
        <v-form ref="addPermissionForm" @submit.prevent="submitAddPermission">
          <v-text-field v-model="newPermission.name" label="Name" required />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          class="text-body-2 px-4 mr-2"
          elevation="1"
          @click="showAddPermissionDialog = false"
          style="background-color: #f44336; color: white"
        >
          Abbrechen
        </v-btn>
        <v-btn
          class="text-body-2 px-4"
          elevation="1"
          @click="submitAddPermission"
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
import { onMounted, ref } from 'vue'
import { getAllPermissions, createAPermission, deleteAPermission } from '@/api/index.js'
import { notify } from '@/utils/notify'

const headers = [
  { title: 'Rechte', key: 'name', minWidth: '10em' },
  { title: 'Aktionen', key: 'action', sortable: false, width: '5em' },
]

const permissions = ref([])
const snackbar = ref({ open: false, text: '', color: 'success' })

// Modal
const showAddPermissionDialog = ref(null)
const newPermission = ref({ name: '' })

// Daten laden
onMounted(async () => {
  await loadPermissions()
})

async function loadPermissions() {
  const permissionsRes = await getAllPermissions() // [{"id": 6, "name": "role_delete"}]

  permissions.value = permissionsRes.data.map((i) => ({
    id: i.id,
    name: mapPermissionName(i.name),
  }))
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

async function deletePermission(item) {
  try {
    await deleteAPermission(item.id)
    notify(snackbar, `Rechte ${item.name} erfolgreich gelöscht`, 'success')
  } catch (err) {
    notify(snackbar, 'Fehler beim Löschen der Rechte ${item.name}', 'error')
  }
  await loadPermissions()
}

async function submitAddPermission() {
  const permission = newPermission.value
  if (!permission.name?.trim()) {
    alert('Bitte ein Name eingeben')
    return
  }
  try {
    const res = await createAPermission({
      name: permission.name,
    })
    if (res.status === 201) {
      notify(snackbar, 'Rechte erfolgreich angelegt', 'success')
    } else {
      notify(snackbar, 'Fehler beim Anlegen der Rechte', 'error')
    }
    notify(snackbar, 'Rechte erfolgreich angelegt', 'success')
  } catch (err) {
    notify(snackbar, 'Fehler beim Anlegen der Rechte', 'error')
  } finally {
    // Dialog schließen & Formular resetten
    resetAddPermissionForm()
    showAddPermissionDialog.value = false
  }
  await loadPermissions()
}

function resetAddPermissionForm() {
  newPermission.value = {
    name: '',
  }
}
</script>
