import { useAppStore } from '../store/app.store';

export const useAuth = () => {
  const { user, isAuthenticated, isHydrated, logout } = useAppStore();
  
  return {
    user,
    isAuthenticated,
    isHydrated,
    logout,
  };
};
