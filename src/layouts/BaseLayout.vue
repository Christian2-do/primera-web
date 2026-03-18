<template>
    <ion-page>
        <ion-menu content-id="main-content">
            <ion-header>
            <ion-toolbar color="tertiary">
                <ion-title>Menu</ion-title>
            </ion-toolbar>
            </ion-header>
            <ion-content>
                <ion-list>
                    <ion-item>
                        <ion-avatar aria-hidden="true" slot="start">
                            <img alt="" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                        </ion-avatar>
                        <ion-label>{{ userStore.userData.usuario }}</ion-label>
                        <ion-button slot="end" fill="solid" size="small" @click="handleLogout">Salir</ion-button>
                    </ion-item>
                    <ion-accordion-group>
                        <template v-for="(menu, key) in contentStore.menu" :key="key">
                            <ion-accordion :value="'menu-'+key">
                                <ion-item slot="header" color="light">
                                    <ion-label><i :class="menu.icon"></i> {{ menu.name }}</ion-label>
                                </ion-item>
                                <div slot="content">
                                    <ion-list>
                                        <template v-for="(item, itemKey) in menu.sub" :key="itemKey">
                                            <ion-menu-toggle v-if="item.active === 'yes'">
                                                <ion-item 
                                                :router-link="'/'+item.url"
                                                @click="contentStore.$getContent(item.internal_name)"
                                                >
                                                    <ion-label>{{ item.name }}</ion-label>
                                                </ion-item>
                                            </ion-menu-toggle>
                                        </template>
                                    </ion-list>
                                </div>
                            </ion-accordion>
                        </template>
                    </ion-accordion-group>
                </ion-list>
            </ion-content>
            <ion-footer>
                <ion-button slot="end" fill="solid" size="small" class="boton-rojo" @click="router.push({ name: 'Camara'})">Cámara</ion-button>
            </ion-footer>
        </ion-menu>
        <ion-header>
        <ion-toolbar>
            <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
            </ion-buttons>
            <ion-title>{{ contentStore.content.contenido.name || 'Contenido' }}</ion-title>
            <ion-progress-bar v-if="contentStore.loading" type="indeterminate"></ion-progress-bar>
        </ion-toolbar>
        </ion-header>
        <ion-content id="main-content" class="ion-padding">
            <ion-router-outlet></ion-router-outlet>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
  import { IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar, IonFooter } from '@ionic/vue';
  import { IonAccordion, IonAccordionGroup, IonItem, IonLabel, IonList, IonAvatar, IonButton, IonRouterOutlet,
    IonMenuToggle, IonProgressBar   } from '@ionic/vue';
  import { useUserStore } from '@/stores/user';
  import { useContentStore } from '@/stores/content';
  import { useRouter, useRoute } from 'vue-router';
  
  const contentStore = useContentStore();
  const userStore = useUserStore();
  const router = useRouter();
  const route = useRoute();
  async function handleLogout(){
    await userStore.$setLogin(null);
    router.push('/login');
  }

    // Load content if a specific section is requested
    if (!contentStore.content.to && route.params.name) {
        contentStore.$getContent(route.params.name as string);
    }

    // If no section name in the route, load the home content
    if (!route.params.name) {
        if (contentStore.home.internal_name) {
            contentStore.$getContent(contentStore.home.internal_name as string).then(() => {
                // Only redirect if we have a valid URL
                if (contentStore.home.url) {
                    router.push({ path: '/' + contentStore.home.url });
                }
            });
        } else {
            // No home data available – redirect to login or show a fallback
            router.push('/login');
        }
    }
  //comentario de prueba
</script>

<style scoped>
  ion-menu::part(backdrop) {
    background-color: rgba(255, 0, 255, 0.5);
  }

  ion-menu::part(container) {
    border-radius: 0 20px 20px 0;

    box-shadow: 4px 0px 16px rgba(255, 0, 255, 0.18);
  }
</style>