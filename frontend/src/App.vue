<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Benutzer-Rollenverwaltung Demo</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list nav density="comfortable">
        <v-list-item to="/users" title="Benutzer & Rollenbezogen" prepend-icon="mdi-account-cog" />
      </v-list>
      <v-list nav density="comfortable">
        <v-list-item
          to="/roles"
          title="Benutzerrolle / Berechtigung"
          prepend-icon="mdi-shield-key"
        />
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container class="py-6" max-width="80em" min-width="60em" style="font-size: x-large">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(false)
</script>
