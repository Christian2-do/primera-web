<template>
    <ion-page v-if="!contentStore.loading">
        <ion-content class="ion-padding" >
            <div v-html="contentStore.content.contenido.contenido"></div>
            <div class="video-container" v-if="contentStore.content.contenido.youtube">
                <iframe 
                    width="560" 
                    height="315" 
                    :src="'https://www.youtube.com/embed/'+contentStore.content.contenido.youtube.replace('https://youtu.be/','')" 
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerpolicy="strict-origin-when-cross-origin"
                     allowfullscreen>
                    </iframe>
            </div>
        </ion-content>
        <ion-footer :translucent="true">
            <ion-toolbar>
            <ion-button 
              slot="end" 
              fill="solid" 
              size="small" 
              @click="siguiente()" 
              class="boton-rojo"
              v-if="contentStore.next.url">Siguiente</ion-button>
             <ion-progress-bar v-if="contentStore.loading" type="indeterminate"></ion-progress-bar>
            </ion-toolbar>
        </ion-footer>
    </ion-page>
    <SkeletonText v-else></SkeletonText>
</template>
<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButton, IonProgressBar } from '@ionic/vue';
import { useRoute, useRouter } from 'vue-router';
import { useContentStore } from '@/stores/content';
import SkeletonText from '@/components/SkeletonText.vue';
const route = useRoute(); 
const contentStore = useContentStore();
const router = useRouter();


contentStore.$getContent(contentStore.home.internal_name).then( res => {
    router.push({ path: '/'+contentStore.home.url });
});

checkNext()

function checkNext(){
  let i = 0;
  setTimeout(() => {
    contentStore.menu.map( (item: any) => {
      item.sub.map( (sub_item: any) => {
        if(i === 1){
          contentStore.$setNext(sub_item)
          i++;
        }
        if(sub_item.internal_name === route.params.name){
          i++;
        }
      })
    })
  }, 200)
}

async function setNext(){

  contentStore.menu.map( (item: any) => {
    item.sub.map( (sub_item: any) => {
      if(sub_item.id === contentStore.next.id) {
        sub_item.active = 'yes';
        contentStore.$setHome(contentStore.next)
      }
    })
  })
  
  localStorage.setItem('menu', JSON.stringify(contentStore.menu));
  
}

async function siguiente(){
    if(contentStore.next.url){
        
        setNext();
        checkNext();
        contentStore.$seteaSiguiente();
        router.push('/' + contentStore.next.url);
        //contentStore.$getContent(contentStore.next.internal_name).then( res => {
            
        //})
    }
}
</script>
<style scoped>
.video-container {
  position: relative;
  padding-bottom: 56.25%; /* Aspect ratio 16:9 */
  height: 0;
  overflow: hidden;
}
.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>