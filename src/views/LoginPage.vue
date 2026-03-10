<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Iniciar Sesión</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding login-content">
      <div class="login-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Bienvenido</ion-card-title>
            <ion-card-subtitle>Ingresa tus credenciales</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <form @submit.prevent="login" class="login-form">
              <ion-item>
                <ion-label position="floating" class="label-spacing">Usuario</ion-label>
                <ion-input v-model="username" required class="input-spacing"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating" class="label-spacing">Contraseña</ion-label>
                <ion-input v-model="password" type="password" required class="input-spacing"></ion-input>
              </ion-item>
              <ion-button expand="full" type="submit" :disabled="!isFormValid" class="login-button">
                Iniciar Sesión
              </ion-button>
            </form>
            <p style="text-align:center; margin-top:10px;"><router-link to="/register">¿No tienes cuenta? Regístrate</router-link></p>
            <p style="text-align:center; margin-top:10px;">
              <button @click="goToRegister" style="background:none;border:none;color:#667eea;cursor:pointer;">Regístrate</button>
            </p>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { loginApi, saveToken } from '@/services/auth';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue';

const router = useRouter();
const userStore = useUserStore();
const username = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false);

const isFormValid = computed(() => !!username.value && !!password.value && !loading.value);

const login = async () => {
  errorMessage.value = '';
  loading.value = true;
  try {
    console.log('Attempting login with', { username: username.value });
    const res = await loginApi(username.value, password.value);
    if (res && res.token) {
      saveToken(res.token);
      userStore.login({ name: res.user?.name || username.value, email: res.user?.email || null, password: '' });
      console.log('Login successful, redirecting to /tabs/tab1');
      router.push('/tabs/tab1');
    } else {
      errorMessage.value = 'Respuesta inválida del servidor';
    }
  } catch (err: any) {
    errorMessage.value = err?.message || 'Error al iniciar sesión';
  } finally {
    loading.value = false;
  }
};

const goToRegister = () => {
  console.log('Navigating to register');
  router.push('/register');
};
</script>

<style scoped>
.login-content { display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.login-container { width: 100%; max-width: 400px; }
ion-card { border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
.login-form { display:flex; flex-direction:column; gap:25px; }
.label-spacing { letter-spacing: 2px; }
.input-spacing { padding-top: 10px; }
.login-button { margin-top: 20px; --background: #667eea; --background-hover: #5a6fd8; --background-activated: #4e63c4; }
.error-message { color: #ff6b6b; text-align: center; margin-top: 15px; font-weight: bold; }
</style>