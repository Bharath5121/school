import { authRepository } from '../repositories/auth.repository';
import { LoginRequestDto, RegisterRequestDto } from '../dtos/auth.dto';
import { AuthUserModel } from '../models/auth.model';

export class AuthService {
  async authenticateUser(credentials: LoginRequestDto) {
    const data = await authRepository.login(credentials);
    // Maps raw valid entity into Frontend Model
    return {
      user: AuthUserModel.fromResponse(data.user),
      accessToken: data.accessToken
    };
  }

  async registerUser(data: RegisterRequestDto) {
    const resp = await authRepository.register(data);
    return {
      user: AuthUserModel.fromResponse(resp.user),
      accessToken: resp.accessToken
    };
  }

  async logout() {
    await authRepository.logout();
  }
}

export const authService = new AuthService();
