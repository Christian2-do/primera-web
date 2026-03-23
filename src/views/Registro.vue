<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Registro</ion-title>
        <ion-progress-bar v-if="loading" type="indeterminate"></ion-progress-bar>
        <ion-buttons slot="end">
          <ion-button fill="solid" @click="router.push('/login')">Login</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item lines="none">
        <ion-input
          label="Usuario"
          class="ion-margin-top"
          label-placement="floating"
          fill="outline"
          v-model="name"
          placeholder="Ingrese el usuario"
        />
      </ion-item>
      <ion-item v-if="$v.value.name.$error">
        <ion-label color="danger">
          El usuario es requerido y debe tener al menos 4 caracteres
        </ion-label>
      </ion-item>

      <ion-item lines="none">
        <ion-input
          label="Email"
          class="ion-margin-top"
          label-placement="floating"
          fill="outline"
          v-model="email"
          placeholder="Ingrese un email"
        />
      </ion-item>
      <ion-item v-if="$v.value.email.$error">
        <ion-label color="danger">
          El email es requerido y debe tener un formato válido
        </ion-label>
      </ion-item>

      <ion-item lines="none">
        <ion-input
          label="Contraseña"
          label-placement="floating"
          class="ion-margin-top"
          fill="outline"
          placeholder="**********"
          v-model="password"
          type="password"
        />
      </ion-item>
      <ion-item v-if="$v.value.password.$error">
        <ion-label color="danger">
          La contraseña es requerida y debe tener al menos 6 caracteres
        </ion-label>
      </ion-item>

      <!-- Confirm Password -->
      <ion-item lines="none">
        <ion-input
          label="Confirmar Contraseña"
          label-placement="floating"
          class="ion-margin-top"
          fill="outline"
          placeholder="**********"
          v-model="confirmPassword"
          type="password"
        />
      </ion-item>
      <ion-item v-if="$v.value.confirmPassword.$error || (password !== confirmPassword && $v.value.confirmPassword.$dirty) ">
        <ion-label color="danger">
          Las contraseñas no coinciden
        </ion-label>
      </ion-item>

      <ion-item class="ion-margin-bottom" lines="none">
        <ion-button slot="end" size="default" @click="handleRegister">
          Registrarse
        </ion-button>
      </ion-item>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton, IonLabel, IonProgressBar, alertController } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, email as emailValidator, minLength, sameAs } from '@vuelidate/validators';
import { ref } from 'vue';
import { useRegisterForm } from '@/composables/useRegisterForm';

const router = useRouter();
const loading = ref(false);

const { name, email, password, confirmPassword, register } = useRegisterForm();

const $v = useVuelidate(
  {
    name: { required, minLength: minLength(4) },
    email: { required, email: emailValidator },
    password: { required, minLength: minLength(6) },
    confirmPassword: { required, sameAsPassword: sameAs(() => password.value) },
  },
  { name, email, password, confirmPassword }
);

async function handleRegister() {
  $v.value.$touch();
  if ($v.value.$invalid) return;
  loading.value = true;
  try {
    await register();
    router.push('/tabs/tab1');
  } catch (err: any) {
    const message = err?.response?.data?.message || err?.message || 'Error al registrar';
    await alertController.create({
      header: 'Error de registro',
      message,
      buttons: ['Continuar'],
    }).then((alert) => alert.present());
  } finally {
    loading.value = false;
  }
}
</script>
