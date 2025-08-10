<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <v-card width="400" class="pa-4">
      <v-card-title class="text-h6 font-weight-bold">Login</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleLogin" ref="formRef" lazy-validation>
          <v-text-field
            v-model="email"
            label="E-Mail"
            type="email"
            required
          />
          <v-text-field
            v-model="password"
            label="Passwort"
            type="password"
            required
          />
          <v-btn
            type="submit"
            color="primary"
            block
            :loading="loading"
          >
            Anmelden
          </v-btn>
          <v-alert
            v-if="error"
            type="error"
            class="mt-4"
            dense
          >
            {{ error }}
          </v-alert>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'

export default {
  name: 'LoginView',
  setup() {
    const email = ref('')
    const password = ref('')
    const loading = ref(false)
    const error = ref('')
    const formRef = ref(null)

    const handleLogin = async () => {
      error.value = ''
      loading.value = true

      try {
        const response = await axios.post('/api/login', {
          email: email.value,
          password: password.value,
        })

        // Speichere Token oder redirect
        const token = response.data.token
        localStorage.setItem('token', token)

        // Weiterleiten z.B. zum Dashboard
        window.location.href = '/dashboard'
      } catch (err) {
        error.value = 'Login fehlgeschlagen. Bitte überprüfe deine Daten.'
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      password,
      loading,
      error,
      formRef,
      handleLogin
    }
  }
}
</script>

<style scoped>
.v-container {
  background: #f5f5f5;
}
</style>
