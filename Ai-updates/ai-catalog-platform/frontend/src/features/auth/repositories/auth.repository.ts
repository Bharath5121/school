import { apiClient } from '../../../lib/api-client';
import { LoginRequestDto, RegisterRequestDto, AuthResponseDto } from '../dtos/auth.dto';

// Pure Network/Data access tier
export class AuthRepository {
  async login(credentials: LoginRequestDto): Promise<AuthResponseDto> {
    const response: any = await apiClient.post('/auth/login', credentials);
    return response.data;
  }

  async register(data: RegisterRequestDto): Promise<AuthResponseDto> {
    const response: any = await apiClient.post('/auth/register', data);
    return response.data;
  }

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  }

  async me(): Promise<any> {
    const response: any = await apiClient.get('/auth/me');
    return response.data;
  }
}
export const authRepository = new AuthRepository();
