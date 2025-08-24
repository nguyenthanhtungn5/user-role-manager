<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-data-table :headers="headers" :items="usersWithRoles" item-key="id">
          <template #[`item.roles`]="{ item }">
            <v-select
              v-model="item.roleIds"
              :items="roles"
              item-title="name"
              item-value="id"
              multiple
              chips
              density="comfortable"
              hide-details
              @update:model-value="updateUserRoles(item)"
            />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

// Tabellen-Spalten
const headers = [
  { title: "ID", key: "id" },
  { title: "Vorname", key: "firstName" },
  { title: "Nachname", key: "lastName" },
  { title: "E-Mail", key: "email" },
  { title: "Telefon", key: "phone" },
  { title: "Rollen", key: "roles" },
];

const users = ref([]);
const roles = ref([]);
const assignments = ref([]);

//const saving = ref(new Set());

const usersWithRoles = computed(() => {
  return users.value.map((user) => {
    const assignedRoleIds = assignments.value
      .filter((a) => a.userid === user.id)
      .map((a) => a.roleid);

    return {
      ...user,
      roleIds: assignedRoleIds,
    };
  });
});

// Daten laden
onMounted(async () => {
  const [usersRes, rolesRes, assignmentsRes] = await Promise.all([
    axios.get("http://localhost:8888/api/users"),
    axios.get("http://localhost:8888/api/roles"),
    axios.get("http://localhost:8888/api/assign/user-roles"),
  ]);

  users.value = usersRes.data;
  roles.value = rolesRes.data;
  assignments.value = assignmentsRes.data;
});

// Rollen speichern (PUT)
async function updateUserRoles(user) {
  try {
    await axios.put("http://localhost:8888/api/assign/user-roles", {
      userId: user.id,
      roleIds: user.roleIds,
    });
    console.log("Rollen aktualisiert für", user.firstName);
  } catch (err) {
    console.error("Fehler beim Speichern der Rollen", err);
  }
}
</script>
