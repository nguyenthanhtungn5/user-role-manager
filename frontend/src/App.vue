<template>
  <v-app>
    <v-app-bar class="bg-grey-lighten-4 text-grey-darken-3" elevation="2">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Benutzer-Rollenverwaltung Demo</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary class="bg-grey-lighten-3 text-grey-darken-3">
      <v-list nav density="comfortable">
        <v-list-item to="/users" title="Benutzer" prepend-icon="mdi-account-cog" />
        <v-list-item to="/roles" title="Benutzerrolle" prepend-icon="mdi-shield-key" />
        <v-list-item to="/permissions" title="Berechtigung" prepend-icon="mdi-key" />
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container
        class="py-6 bg-grey-lighten-5"
        max-width="80em"
        height="85vh"
        style="font-size: large"
      >
        <router-view />
      </v-container>
    </v-main>
    <v-footer
      class="d-flex align-center justify-center ga-2 flex-wrap flex-grow-1 py-1 bg-grey-lighten-4 text-grey-darken-2"
      style="height: 10px"
    >
      <v-btn v-for="link in links" :key="link" :text="link" variant="text" rounded></v-btn>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(false)
const links = ['Startseite', 'Über uns', 'Team', 'Dienstleistungen', 'Blog', 'Kontakt']
</script>
