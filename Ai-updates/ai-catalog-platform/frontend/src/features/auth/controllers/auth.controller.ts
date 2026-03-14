import { useState } from 'react';
import { authService } from '../services/auth.service';
import { useAppStore } from '../../../store/app.store';
import { useRouter } from 'next/navigation';
import { LoginRequestDto } from '../dtos/auth.dto';

/**
 * Controller Hook extracting logic from UI completely.
 */
export const useAuthController = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setAccessToken, setUser } = useAppStore();

  const handleLogin = async (credentials: LoginRequestDto) => {
    setLoading(true);
    setError(null);
    try {
      const { user, accessToken } = await authService.authenticateUser(credentials);
      setAccessToken(accessToken);
      setUser(user as any); 
      
      if (user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        const isOnboarded = user.onboardingCompleted || user.profile?.onboardingCompleted;
        router.push(isOnboarded ? '/feed' : '/onboarding');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const { user, accessToken } = await authService.registerUser(data);
      setAccessToken(accessToken);
      setUser(user as any);
      router.push(user.role === 'ADMIN' ? '/admin' : '/onboarding');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    handleLogin,
    handleRegister
  };
};
