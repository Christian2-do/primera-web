import{ defineSotres } from 'pinia'

export const useUserStore = defineSotres('user', {
  state: () => ({
    name: 'John Doe',
    email: null,
    password: null,
    