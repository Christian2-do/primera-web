import { defineStore } from "pinia";
import { ref } from "vue";
import axiosRiksiri from "@/axios/axiosRiksiri";

export const useContentStore = defineStore('content', () => {
    const menu = ref(localStorage.getItem('menu') ? JSON.parse(localStorage.getItem('menu') as string) : null);
    const content = ref({
        contenido:{
            name: null,
            contenido: null,
            youtube: '',
        },
        to: null,
        internal_name: null,
    }); 
    const home = ref(localStorage.getItem('home') ? JSON.parse(localStorage.getItem('home') as string) : {
        url: null,
        internal_name: '',
    });
    
   
    const next = ref({
        id: null,
        url: null,
        internal_name: '',
    });
    const loading = ref(false);
    function setContent(data: any | null){
        content.value = data || {
            
        };
    }   
    function $setMenu(data: any | null){
        menu.value = data || [];
        if(menu.value){
            localStorage.setItem('menu', JSON.stringify(menu.value));
        } else {
            localStorage.removeItem('menu');
        }   
    }   

    function $setHome(data: any | null){
        home.value = data || {};
        localStorage.setItem('home', JSON.stringify(home.value));
    }   

    function $getContent(name: string){
        loading.value = true;
        return axiosRiksiri.get('/contenido/'+name).then( res => {
            setContent(res.data);
            loading.value = false;
            return res.data;
        })
    }

    function $seteaSiguiente(){
        return axiosRiksiri.post('/seteasiguiente', next.value);
    }

    function $setNext(data: any | null){
        next.value = data || {};
    }

    return { content, setContent, menu, $setMenu, $getContent, loading, home, $setHome, next, $setNext, $seteaSiguiente };

});