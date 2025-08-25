<style scoped>
.custom-dialog-overlay {
  backdrop-filter: blur(8px);
  background-color: rgba(0, 0, 0, 0.2);
}
</style>

<template>
  <v-container>
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h4">Benutzer verwalten</span>
      <v-btn
        @click="showAddUserDialog = true"
        class="text-body-2 px-2 bg-grey-lighten-4 text-grey-darken-2"
        elevation="2"
        color="primary"
        >Neue Benutzer anlegen</v-btn
      >
    </v-card-title>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="usersWithRoles"
        item-key="id"
        :items-per-page="5"
        :items-per-page-options="[5, 10, 20, 50]"
      >
        <template #[`item.roles`]="{ item }">
          <v-select
            :model-value="item.roleIds"
            :items="roles"
            item-title="name"
            item-value="id"
            multiple
            chips
            hide-details
            density="comfortable"
            @update:model-value="(val) => updateUserRoles(item, val)"
            :loading="loadingUpdateRoles[item.id] === true"
          />
        </template>
        <template #[`item.action`]="{ item }">
          <div class="d-flex justify-center align-center" style="height: 100%; gap: 8px">
            <v-tooltip text="Benutzer löschen" location="bottom">
              <template #activator="{ props }">
                <v-icon
                  v-bind="props"
                  icon
                  color="error"
                  style="cursor: pointer"
                  @click="deleteUser(item)"
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
    v-model="showAddUserDialog"
    max-width="600px"
    min-width="500px"
    overlay-class="custom-dialog-overlay"
  >
    <v-card class="px-4 py-4">
      <v-card-title class="text-h6">Neue Benutzer anlegen</v-card-title>
      <v-card-text>
        <v-form ref="addUserForm" @submit.prevent="submitAddUser">
          <v-text-field
            v-model="newUser.firstName"
            label="Vorname*"
            :rules="[(v) => !!v || 'Vorname ist erforderlich']"
          />
          <v-text-field
            v-model="newUser.lastName"
            label="Nachname*"
            :rules="[(v) => !!v || 'Nachname ist erforderlich']"
          />
          <v-text-field
            v-model="newUser.email"
            label="E-Mail*"
            type="email"
            required
            :rules="[(v) => !!v || 'E-Mail ist erforderlich', emailRule]"
          />
          <v-text-field v-model="newUser.phone" label="Telefone" :rules="[telephoneRule]" />
          <v-select
            v-model="newUser.roleIds"
            :items="roles"
            item-title="name"
            item-value="id"
            label="Rollen*"
            multiple
            chips
            :rules="[(v) => (v && v.length > 0) || 'Mindestens eine Rolle auswählen']"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          class="text-body-2 px-4 mr-2"
          elevation="1"
          @click="showAddUserDialog = false"
          style="background-color: #f44336; color: white"
        >
          Abbrechen
        </v-btn>
        <v-btn
          class="text-body-2 px-4"
          elevation="1"
          @click="submitAddUser"
          style="background-color: #1867c0; color: white"
          :loading="loadingCreateUsers"
        >
          Speichern
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  getAllUsers,
  getAllRoles,
  getUserRoles,
  createAUser,
  assignUserRoles,
  deleteAUser,
} from '@/api/index.js'
import { notify } from '@/utils/notify'

// Tabellen-Spalten
const headers = [
  { title: 'Vorname', key: 'firstName', minWidth: '4em' },
  { title: 'Nachname', key: 'lastName', minWidth: '4em' },
  { title: 'E-Mail', key: 'email', minWidth: '4em' },
  { title: 'Telefon', key: 'phone', minWidth: '4em' },
  { title: 'Rollen', key: 'roles', minWidth: '8em' },
  { title: 'Aktionen', key: 'action', sortable: false, width: '5em' },
]

const users = ref([])
const roles = ref([])
const userRolesByUser = ref({})
const snackbar = ref({ open: false, text: '', color: 'success' })
const loadingUpdateRoles = ref({}) // { [roleId]: true | false }
const loadingCreateUsers = ref(null) // true | false
const addUserForm = ref(null)

// Modal
const showAddUserDialog = ref(null)
const newUser = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  roleIds: [],
})
const emailRule = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Ungültige E-Mail-Adresse'
const telephoneRule = (v) => !v || /^\+?[0-9]{2,15}$/.test(v) || 'Ungültige Telefonnummer'
// Daten laden
onMounted(async () => {
  loadUsers()
})

async function loadUsers() {
  const [usersRes, rolesRes, assignmentsRes] = await Promise.all([
    getAllUsers(),
    getAllRoles(),
    getUserRoles(),
  ])

  users.value = usersRes.data
  roles.value = rolesRes.data

  const grouped = {}
  assignmentsRes.data.forEach(({ userid, roleid }) => {
    if (!grouped[userid]) grouped[userid] = []
    grouped[userid].push(roleid)
  })
  userRolesByUser.value = grouped
}

const usersWithRoles = computed(() => {
  return users.value.map((user) => ({
    ...user,
    roleIds: userRolesByUser.value[user.id] || [],
  }))
})

// Rollen speichern (PUT)
async function updateUserRoles(user, newIds) {
  if (newIds.length === 0) {
    notify(snackbar, 'Ein Benutzer kann nicht ohne Rolle gespeichert werden', 'error')
    return
  }
  const userId = user.id
  try {
    loadingUpdateRoles.value = { ...loadingUpdateRoles.value, [userId]: true }

    await assignUserRoles({
      userId: userId,
      roleIds: newIds,
    })
    userRolesByUser.value = {
      ...userRolesByUser.value,
      [userId]: newIds,
    }
    notify(snackbar, `Rollen für "${user.firstName}" gespeichert`, 'success')
  } catch (err) {
    notify(snackbar, 'Fehler beim Speichern des Benutzers', err)
  } finally {
    // Loading aus
    loadingUpdateRoles.value = { ...loadingUpdateRoles.value, [userId]: false }
  }
}

async function submitAddUser() {
  const user = newUser.value
  const form = addUserForm.value
  const validation = await form.validate()
  console.log(validation.valid)
  if (!validation.valid) return

  loadingCreateUsers.value = true
  try {
    const res = await createAUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    })
    if (res.status === 201 && res.data?.id && user.roleIds.length > 0) {
      const userId = res.data.id
      await assignUserRoles({
        userId: userId,
        roleIds: user.roleIds,
      })
      userRolesByUser.value = {
        ...userRolesByUser.value,
        [userId]: user.roleIds,
      }
    } else {
      notify(snackbar, 'Fehler beim Anlegen des Benutzers', 'error')
    }
    notify(snackbar, 'Benutzer erfolgreich angelegt', 'success')
  } catch (err) {
    notify(snackbar, 'Fehler beim Anlegen des Benutzers', 'error')
  } finally {
    // Dialog schließen & Formular resetten
    resetAddUserForm()
    showAddUserDialog.value = false
    loadingCreateUsers.value = false
  }
  await loadUsers()
}

async function deleteUser(item) {
  try {
    const res = await deleteAUser(item.id)
    if (res.status === 204) {
      notify(snackbar, `Benutzer mit Email "${item.email}" wurde gelöscht`, 'success')
    } else {
      notify(snackbar, `Fehler beim Löschen des Benutzers mit Email "${item.email}"`, 'error')
    }
  } catch (err) {
    notify(snackbar, `Fehler beim Löschen des Benutzers mit Email "${item.email}"`, 'error')
  }
  await loadUsers()
}

function resetAddUserForm() {
  newUser.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    roleIds: [],
  }
}
</script>
