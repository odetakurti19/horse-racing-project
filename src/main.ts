import { createApp } from "vue"
import { store, key } from "@/stores"
import PrimeVue from "primevue/config"
import Aura from "@primeuix/themes/aura"
import "primeicons/primeicons.css"
import "./style.css"
import App from "./App.vue"

const app = createApp(App)

app.use(store, key)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: ".p-dark",
    },
  },
})
app.mount("#app")
