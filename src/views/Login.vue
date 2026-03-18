<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Login</ion-title>

                <!-- Barra de carga -->
                <ion-progress-bar 
                    v-if="loading" 
                    type="indeterminate">
                </ion-progress-bar>

                <!-- Botón registro -->
                <ion-buttons slot="end">
                    <ion-button 
                        fill="solid" 
                        @click="router.push({ name: 'Registro'})">
                        Registrarse
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">

            <!-- Usuario -->
            <ion-item lines="none">                
                <ion-input 
                    label="Usuario" 
                    :disabled="loading"
                    class="ion-margin-top"
                    label-placement="floating" 
                    fill="outline" 
                    v-model="userStore.name"
                    placeholder="Ingrese usuario">
                </ion-input>
            </ion-item>

            <!-- Contraseña -->
            <ion-item lines="none">
                <ion-input 
                    label="Contraseña" 
                    :disabled="loading"
                    label-placement="floating" 
                    class="ion-margin-top"
                    fill="outline" 
                    placeholder="Ingrese contraseña" 
                    v-model="userStore.password"
                    @keyup.enter="handleLogin"
                    type="password">
                </ion-input>
            </ion-item>   

            <!-- Botón login -->
            <ion-item class="ion-margin-bottom" lines="none">
                <ion-button 
                    slot="end" 
                    size="default" 
                    color="success"
                    @click="handleLogin"
                    :disabled="loading || !userStore.name || !userStore.password"
                > 
                    <span v-if="!loading">Ingresar</span>
                    <ion-spinner v-if="loading" name="crescent"></ion-spinner>
                </ion-button>
            </ion-item>

        </ion-content>
    </ion-page>
</template>

<script lang="ts" setup>
import { IonPage, IonHeader, IonToolbar, 
    IonTitle, IonContent, alertController, 
    IonItem, IonInput, IonButton, IonButtons, 
    IonSpinner, IonProgressBar } from '@ionic/vue';

import { useUserStore } from '@/stores/user';
import { useContentStore } from '@/stores/content';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const userStore = useUserStore();
const contentStore = useContentStore();
const router = useRouter();
const loading = ref(false);

// 🔐 LOGIN MEJORADO
async function handleLogin() {

    // ✅ Validación de campos
    if (!userStore.name || !userStore.password) {
        const alert = await alertController.create({
            header: 'Campos requeridos',
            message: 'Debe ingresar usuario y contraseña',
            buttons: ['OK']
        });
        return alert.present();
    }

    loading.value = true;

    try {
        // 🔐 Login (sin email innecesario)
        await userStore.login({
            name: userStore.name,
            email: userStore.email,
            password: userStore.password
        });

        // 📦 Cargar contenido seguro
        if (contentStore.home?.value) {
            await contentStore.$getContent(contentStore.home.value.internal_name);

            router.push({
                path: '/' + contentStore.home.value.url
            });
        } else {
            // fallback
            router.push('/');
        }

    } catch (error: any) {

        const alert = await alertController.create({
            header: 'Error de inicio de sesión',
            message: error?.message || 'Credenciales incorrectas',
            buttons: ['Continuar']
        });

        await alert.present();

    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
ion-button {
    margin-top: 10px;
}
</style>