<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Cámara</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Vista previa de la cámara -->
      <video ref="videoRef" autoplay playsinline class="preview" v-if="stream" />
      <!-- Botones separados -->
      <div class="controls">
        <ion-button color="primary" @click="startCamera">Activar Cámara</ion-button>
        <ion-button color="success" @click="takePhoto" :disabled="!stream">Tomar Foto</ion-button>
      </div>
      <!-- Imagen capturada -->
      <img v-if="imageSrc" :src="imageSrc" class="preview" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';

const imageSrc = ref<string | null>(null);
const stream = ref<MediaStream | null>(null);
const videoRef = ref<HTMLVideoElement | null>(null);

// Iniciar cámara en el navegador
async function startCamera() {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.value) {
      videoRef.value.srcObject = stream.value;
      await videoRef.value.play();
    }
  } catch (err) {
    console.error('No se pudo acceder a la cámara:', err);
  }
}

// Tomar foto del stream
function takePhoto() {
  if (!videoRef.value) return;
  const canvas = document.createElement('canvas');
  canvas.width = videoRef.value.videoWidth;
  canvas.height = videoRef.value.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx?.drawImage(videoRef.value, 0, 0);
  imageSrc.value = canvas.toDataURL('image/png');
}
</script>

<style scoped>
.preview {
  width: 100%;
  margin-top: 10px;
  border-radius: 10px;
}
.controls {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
</style>