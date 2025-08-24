<template>
  <v-container>
    <v-card-title>Benutzer verwalten</v-card-title>

    <v-card>
      <v-card-text>
        <v-data-table :headers="headers" :items="usersWithRoles" item-key="id">
          <template #[`item.roles`]="{ item }">
            <v-select
              :model-value="item.roleIds"
              :items="roles"
              item-title="name"
              item-value="id"
              multiple
              chips
              density="comfortable"
              @update:model-value="(val) => updateUserRoles(item, val)"
              :loading="loading[item.id] === true"
            />
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
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// Tabellen-Spalten
const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Vorname', key: 'firstName' },
  { title: 'Nachname', key: 'lastName' },
  { title: 'E-Mail', key: 'email' },
  { title: 'Telefon', key: 'phone' },
  { title: 'Rollen', key: 'roles' },
]

const users = ref([])
const roles = ref([])
const userRolesByUser = ref({})
const snackbar = ref({ open: false, text: '', color: 'success' })
const loading = ref({}) // { [roleId]: true | false }

// Daten laden
onMounted(async () => {
  const [usersRes, rolesRes, assignmentsRes] = await Promise.all([
    axios.get('http://localhost:8888/api/users'), // [{"id": 6,"firstName": "Ada","lastName": "Lovelace8498", "email": "ada8498@example.com", "phone": "+49 151 23456789"}]
    axios.get('http://localhost:8888/api/roles'), // [{ "id": 1,"name": "admin"}]
    axios.get('http://localhost:8888/api/assign/user-roles'), // [{"userid": 1, "roleid": 1}]
  ])

  users.value = usersRes.data
  roles.value = rolesRes.data
  const grouped = {}
  assignmentsRes.data.forEach(({ userid, roleid }) => {
    if (!grouped[userid]) grouped[userid] = []
    grouped[userid].push(roleid)
  })
  userRolesByUser.value = grouped
})

const usersWithRoles = computed(() => {
  return users.value.map((user) => ({
    ...user,
    roleIds: userRolesByUser.value[user.id] || [],
  }))
})

// Rollen speichern (PUT)
async function updateUserRoles(user, newIds) {
  console.log(user, newIds)
  if (newIds.length === 0) {
    notify('Ein Benutzer kann nicht ohne Rolle gespeichert werden', 'error')
    return
  }
  const userId = user.id
  try {
    loading.value = { ...loading.value, [userId]: true }

    await axios.put('http://localhost:8888/api/assign/user-roles', {
      userId: userId,
      roleIds: user.roleIds,
    })
    userRolesByUser.value = {
      ...userRolesByUser.value,
      [userId]: newIds,
    }
    console.log(userRolesByUser.value)
    notify(`Rollen für "${user.firstName}" gespeichert`, 'success')
  } catch (err) {
    notify('Fehler beim Speichern des Benutzers', err)
  } finally {
    // Loading aus
    loading.value = { ...loading.value, [userId]: false }
  }
}

function notify(text, color = 'success') {
  snackbar.value = { open: true, text, color }
}
</script>
