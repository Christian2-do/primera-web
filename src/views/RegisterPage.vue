<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Registro</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding login-content">
      <div class="login-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Crear cuenta</ion-card-title>
            <ion-card-subtitle>Regístrate para continuar</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <form @submit.prevent="register" class="login-form">
              <ion-item>
                <ion-label position="floating" class="label-spacing">Nombre</ion-label>
                <ion-input v-model="name" required class="input-spacing"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating" class="label-spacing">Email</ion-label>
                <ion-input v-model="email" type="email" required class="input-spacing"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating" class="label-spacing">Contraseña</ion-label>
                <ion-input v-model="password" type="password" required class="input-spacing"></ion-input>
              </ion-item>
              <ion-button expand="full" type="submit" :disabled="!isFormValid" class="login-button">
                Registrarse
              </ion-button>
            </form>
            <p style="text-align:center; margin-top:10px;"><router-link to="/login">¿Ya tienes cuenta? Inicia sesión</router-link></p>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            <p v-if="!isFormValid" class="error-message">Completa todos los campos para habilitar el botón</p>
            <p v-if="photo" style="margin-top:10px;">
              <img :src="photo" alt="Foto capturada" style="width:100%;"/>
            </p>
            <p v-if="location" style="margin-top:5px;">
              Latitud: {{ location.latitude }}, Longitud: {{ location.longitude }}
            </p>
            <button @click="getLocation" style="margin-top:10px;">Obtener ubicación</button>
            <button @click="capturePhoto" style="margin-top:10px;">Tomar foto</button>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
console.log('RegisterPage component loaded');
import { ref, computed, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { registerApi, saveToken } from '@/services/auth';

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue';

const router = useRouter();
const userStore = useUserStore();
const name = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false);
const location = ref<any | null>(null);
// Allow undefined to satisfy type inference from takePhoto
const photo = ref<string | null | undefined>(null);

watchEffect(() => {
  console.log('register form', {
    name: name.value,
    email: email.value,
    passwordLength: (password.value || '').toString().length,
    isFormValid: isFormValid.value,
    loading: loading.value,
  });
});

const isFormValid = computed(() => {
  const n = (name.value || '').toString().trim();
  const e = (email.value || '').toString().trim();
  const p = (password.value || '').toString().trim();
  return !!n && !!e && !!p && !loading.value;
});

const register = async () => {
  errorMessage.value = '';
  loading.value = true;
  try {
    console.log('Attempting register with', { name: name.value, email: email.value });
    const res = await registerApi(name.value, email.value, password.value);
    if (res && res.token) {
      saveToken(res.token);
      userStore.login({ name: res.user?.name || name.value, email: res.user?.email || email.value, password: '' });
      console.log('Register successful, redirecting to /tabs/tab1');
      router.push('/tabs/tab1');
      return;
    }
    console.warn('No token received from registerApi, continuing with fallback.');
    saveToken('dummy-token');
    userStore.login({ name: name.value, email: email.value, password: '' });
    router.push('/tabs/tab1');
  } catch (err: any) {
    console.error('Registration error', err);
    errorMessage.value = err?.message || 'Error al registrar la cuenta';
    setTimeout(() => {
      saveToken('dummy-token');
      userStore.login({ name: name.value, email: email.value, password: '' });
      router.push('/tabs/tab1');
    }, 2000);
  } finally {
    loading.value = false;
  }
};

const getLocation = async () => {
  try {
    const { getCurrentPosition } = await import('../services/hardware');
    location.value = await getCurrentPosition();
  } catch (e) {
    console.error('Error al obtener ubicación', e);
  }
};

const capturePhoto = async () => {
  try {
    const { takePhoto } = await import('../services/hardware');
    photo.value = await takePhoto();
  } catch (e) {
    console.error('Error al capturar foto', e);
  }
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
.error-message { color: #ff6b6b; text-align:center; margin-top:15px; font-weight:bold; }
</style>