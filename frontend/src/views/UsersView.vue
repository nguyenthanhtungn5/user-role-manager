<template>
  <v-card>
    <v-card-title class="justify-space-between">
      <span>Users</span>
      <div class="d-flex" style="gap: 8px">
        <v-text-field
          v-model="email"
          label="Suche: Email"
          density="compact"
          hide-details
        />
        <v-btn @click="load" :loading="loading">Reload</v-btn>
        <v-btn color="primary" @click="createOne" :loading="creating"
          >Add</v-btn
        >
      </div>
    </v-card-title>
    <v-data-table
      :items="users"
      :headers="headers"
      :items-per-page="10"
      class="px-2 pb-4"
    />
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from "../api/api.js";
const users = ref([]);
const email = ref("");
const loading = ref(false);
const creating = ref(false);
const headers = [
  { title: "ID", value: "id", width: 70 },
  { title: "First", value: "firstName" },
  { title: "Last", value: "lastName" },
  { title: "Email", value: "email" },
  { title: "Phone", value: "phone" },
];
async function load() {
  loading.value = true;
  try {
    const { data } = await api.get("/api/users", {
      params: { limit: 100, offset: 0, email: email.value || undefined },
    });
    users.value = data;
  } finally {
    loading.value = false;
  }
}
async function createOne() {
  creating.value = true;
  try {
    const n = Math.floor(Math.random() * 10000);
    await api.post("/api/users", {
      firstName: "Ada",
      lastName: "Lovelace" + n,
      email: `ada${n}@example.com`,
      phone: "+49 151 23456789",
    });
    await load();
  } finally {
    creating.value = false;
  }
}
onMounted(load);
</script>
