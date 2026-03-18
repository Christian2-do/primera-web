import { ref, computed, watchEffect } from 'vue';
import { useUserStore } from '@/stores/user';
import { registerApi, saveToken } from '@/services/auth';
import { useRouter } from 'vue-router';

export function useRegisterForm() {
  const router = useRouter();
  const userStore = useUserStore();
  const name = ref('');
  const email = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const errorMessage = ref('');
  const loading = ref(false);

  const isFormValid = computed(() => {
    const n = name.value.trim();
    const e = email.value.trim();
    const p = password.value.trim();
    return !!n && !!e && !!p && !loading.value;
  });

  watchEffect(() => {
    console.log('register form state', {
      name: name.value,
      email: email.value,
      passwordLength: (password.value || '').toString().length,
      isFormValid: isFormValid.value,
      loading: loading.value,
    });
  });

  const register = async () => {
    errorMessage.value = '';
    loading.value = true;
    try {
      const res = await registerApi(name.value, email.value, password.value);
      if (res && res.token) {
        saveToken(res.token);
        userStore.login({ name: res.user?.name || name.value, email: res.user?.email || email.value, password: '' });
        // Show success message before redirect
        errorMessage.value = 'Registro exitoso';
        setTimeout(() => {
          router.push('/tabs/tab1');
        }, 1500);
      } else {
        throw new Error('No token received from registerApi');
      }
    } catch (err: any) {
      console.error('Registration error', err);
      errorMessage.value = err?.message || 'Error al registrar la cuenta';
    } finally {
      loading.value = false;
    }
  };

  return {
    name,
    email,
    password,
    // confirmPassword removed
    errorMessage,
    loading,
    isFormValid,
    register,
  };
}
