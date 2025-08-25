import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import '@mdi/font/css/materialdesignicons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { de } from 'vuetify/locale'

const vuetify = createVuetify({
  components, // jetzt kennt Vue <v-btn>, <v-app-bar>, ...
  directives, // z.B. v-ripple etc.
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  locale: {
    locale: 'de',
    messages: { de },
  },
})

createApp(App).use(router).use(vuetify).mount('#app')
