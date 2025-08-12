import { createApp } from "vue";
import App from "./App.vue";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import router from "./router";

createApp(App).use(createVuetify({})).use(router).mount("#app");
