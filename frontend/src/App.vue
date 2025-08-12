<template>
  <v-app>
    <v-main>
      <v-container class="py-6" max-width="1200">
        <h2 class="mb-4">User Management Demo</h2>

        <v-tabs v-model="tab">
          <v-tab to="/users"        value="users">Users</v-tab>
          <v-tab to="/roles"        value="roles">Roles</v-tab>
          <v-tab to="/permissions"  value="permissions">Permissions</v-tab>
          <v-tab to="/assignments"  value="assignments">Assignments</v-tab>
        </v-tabs>

        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const tab = computed(() => route.name); // hält Tab & Route synchron
</script>
