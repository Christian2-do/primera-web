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
            <p v-if="!isFormValid" class="error-message">Completa todos los campos y verifica que las contraseñas coincidan</p>
            <p v-if="photo" style="margin-top:10px;">
              <img :src="photo" alt="Foto capturada" style="width:100%;"/>
            </p>
            <div v-if="showPreview" style="margin-top:10px;">
              <video ref="videoRef" autoplay playsinline style="width:100%; border:1px solid #ccc;"></video>
            </div>
            <p v-if="location" style="margin-top:5px;">
              Latitud: {{ location.latitude }}, Longitud: {{ location.longitude }}
            </p>
            <button @click="getLocation" style="margin-top:10px;">Obtener ubicación</button>
            <button @click="startPreview" style="margin-top:10px;">Ver cámara</button>
            <button @click="capturePhoto" style="margin-top:10px;" :disabled="!showPreview">Tomar foto</button>
            <button @click="stopPreview" style="margin-top:10px;" :disabled="!showPreview">Detener vista previa</button>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
console.log('RegisterPage component loaded');
import { ref, computed, watchEffect } from 'vue';
import { useRegisterForm } from '@/composables/useRegisterForm';

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue';

  const {
    name,
    email,
    password,
    errorMessage,
    loading,
    isFormValid,
    register,
  } = useRegisterForm();
const location = ref<any | null>(null);
// Camera preview state
const showPreview = ref(false);
const previewStream = ref<MediaStream | null>(null);
const videoRef = ref<HTMLVideoElement | null>(null);
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

  // The composable already provides isFormValid, register, etc.

const getLocation = async () => {
  try {
    const { getCurrentPosition } = await import('../services/hardware');
    location.value = await getCurrentPosition();
  } catch (e) {
    console.error('Error al obtener ubicación', e);
  }
};

const startPreview = async () => {
  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      previewStream.value = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.value) {
        videoRef.value.srcObject = previewStream.value;
        await videoRef.value.play();
      }
      showPreview.value = true;
    }
  } catch (err) {
    console.error('Error starting preview', err);
  }
};

const stopPreview = () => {
  if (previewStream.value) {
    previewStream.value.getTracks().forEach((t) => t.stop());
    previewStream.value = null;
  }
  showPreview.value = false;
};

const capturePhoto = async () => {
  try {
    const { takePhoto } = await import('../services/hardware');
    photo.value = await takePhoto();
  } catch (e) {
    console.error('Error al capturar foto', e);
    // Fallback: use browser camera via getUserMedia and canvas
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.createElement('video');
        video.srcObject = stream;
        await video.play();
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          photo.value = canvas.toDataURL('image/png');
        }
        stream.getTracks().forEach((t) => t.stop());
      } catch (err) {
        console.error('Fallback capture failed', err);
      }
    }
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