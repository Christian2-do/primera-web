<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
            
            <ion-title>Registro</ion-title>
            <ion-progress-bar v-if="loading" type="indeterminate"></ion-progress-bar>
            <ion-buttons slot="end">
                <ion-button fill="solid" @click="router.push({ name: 'Login'})">Login</ion-button>
            </ion-buttons>
        </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <ion-item lines="none">                
                <ion-input 
                    :disabled="loading"
                    label="Usuario" 
                    class="ion-margin-top"
                    label-placement="floating" 
                    fill="outline" 
                    v-model="userStore.registro.usuario"
                    placeholder="Ingrese el usuario">
                </ion-input>
            </ion-item>
            <ion-item v-if="$v.usuario.$errors.length">
                <ion-label color="danger">
                    El usuario es requerido y debe tener al menos 4 caracteres
                </ion-label>
            </ion-item>
            <ion-item lines="none">                
                <ion-input 
                    :disabled="loading"
                    label="Email" 
                    class="ion-margin-top"
                    label-placement="floating" 
                    fill="outline" 
                    v-model="userStore.registro.email"
                    placeholder="Ingrese un email">
                </ion-input>
            </ion-item>
            <ion-item v-if="$v.email.$errors.length">
                <ion-label color="danger">
                    El email es requerido y debe tener un formato válido
                </ion-label>
            </ion-item>
            <ion-item lines="none">
                <ion-input 
                    :disabled="loading"
                    label="Contraseña" 
                    label-placement="floating" 
                    class="ion-margin-top"
                    fill="outline" 
                    placeholder="**********" 
                    v-model="userStore.registro.password"
                    type="password">
                </ion-input>
            </ion-item>
            <ion-item v-if="$v.password.$errors.length">
                <ion-label color="danger">
                    La contraseña es requerida y debe tener al menos 6 caracteres
                </ion-label>
            </ion-item>   
            <ion-item class="ion-margin-bottom" lines="none">
                <ion-button slot="end" size="default" @click="handleRegister" :disabled="loading"> 
                    <span v-if="!loading">Registrarse</span>
                    <ion-spinner v-if="loading" name="crescent"></ion-spinner>
                     </ion-button>
            </ion-item>
        </ion-content>
    </ion-page>

</template>
<script lang="ts" setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, 
    IonInput, IonButton, IonLabel, IonButtons, alertController, IonSpinner, IonProgressBar } from '@ionic/vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'
import  { ref } from 'vue';

const userStore = useUserStore();
const router = useRouter();
const loading = ref(false);

const rules = {
    usuario: {
        required,
        minLength: minLength(4)
    },
    email: {
        required,
        email
    },
    password: {
        required,
        minLength: minLength(6)
    }       
}

const $v = useVuelidate(rules, userStore.registro);

function handleRegister() {

    $v.value.$touch();
    if(!$v.value.$invalid) {
        loading.value = true;
        userStore.$registro().then( () => {
            router.push({ name: 'Seccion' });    
            loading.value = false;   
        }).catch( error => {
            alertController.create({
                header: 'Error de registro',
                message: error.response.data.message,
                buttons: ['Continuar'],
                }).then(alert => alert.present());
            loading.value = false;
        })
    }
}   
</script>