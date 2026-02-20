<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 1</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 1</ion-title>
        </ion-toolbar>
      </ion-header>

      <ExploreContainer name="Tab 1 page" />

      <ion-button @click="openActionSheet">Abrir Action Sheet</ion-button>

      <ion-button @click="fetchPosts" expand="full">Cargar Posts</ion-button>
      <ion-button @click="fetchUsers" expand="full">Cargar Usuarios</ion-button>
      <ion-button @click="fetchBitcoinPrice" expand="full">Cargar Precio Bitcoin</ion-button>

      <div v-if="userStore.posts.length > 0">
        <h2>Posts</h2>
        <ion-list>
          <ion-item v-for="post in userStore.posts.slice(0, 5)" :key="post.id">
            <ion-label>{{ post.title }}</ion-label>
          </ion-item>
        </ion-list>
      </div>

      <div v-if="userStore.users.length > 0">
        <h2>Usuarios</h2>
        <ion-list>
          <ion-item v-for="user in userStore.users.slice(0, 5)" :key="user.id">
            <ion-label>{{ user.name }}</ion-label>
          </ion-item>
        </ion-list>
      </div>

      <div v-if="userStore.bitcoinPrice">
        <h2>Precio Bitcoin</h2>
        <p>USD: {{ userStore.bitcoinPrice.bpi.USD.rate }}</p>
      </div>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonList, IonItem, IonLabel, actionSheetController } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const actionSheetButtons = [
  {
    text: 'Delete',
    role: 'destructive',
    data: {
      action: 'delete',
    },
  },
  {
    text: 'Share',
    data: {
      action: 'share',
    },
  },
  {
    text: 'Cancel',
    role: 'cancel',
    data: {
      action: 'cancel',
    },
  },
];

const openActionSheet = async () => {
  const actionSheet = await actionSheetController.create({
    buttons: actionSheetButtons,
  });
  await actionSheet.present();
};

const fetchPosts = () => {
  userStore.fetchPosts();
};

const fetchUsers = () => {
  userStore.fetchUsers();
};

const fetchBitcoinPrice = () => {
  userStore.fetchBitcoinPrice();
};
</script>
