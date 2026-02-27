import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    name: 'John Doe',
    email: null as string | null,
    password: null as string | null,
    isLoggedIn: false,
    posts: [] as any[],
    users: [] as any[],
    bitcoinPrice: null as any,
  }),
  actions: {
    login(user: { name: string; email: string | null; password: string }) {
      this.name = user.name;
      this.email = user.email;
      this.password = user.password;
      this.isLoggedIn = true;
    },
    logout() {
      this.name = '';
      this.email = null;
      this.password = null;
      this.isLoggedIn = false;
    },
    async fetchPosts() {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        this.posts = data;
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    },
    async fetchUsers() {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        this.users = data;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    async fetchBitcoinPrice() {
      try {
        const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
        const data = await response.json();
        this.bitcoinPrice = data;
      } catch (error) {
        console.error('Error fetching bitcoin price:', error);
      }
    },
  },
})
    