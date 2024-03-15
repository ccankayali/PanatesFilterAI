/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './usersService';

const mockUsersService = {
  findOne: jest.fn((email) => {
    if (email === 'existing@example.com') {
      return Promise.resolve({ id: 'someUserId', email: 'existing@example.com', password: 'password123' });
    }
    return null;
  }),
};

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object if validation is successful', async () => {
      const user = await authService.validateUser('existing@example.com', 'password123');
      expect(user).toEqual({ email: 'existing@example.com', id: 'someUserId' });
    });

    it('should return null if validation fails due to incorrect password', async () => {
      const user = await authService.validateUser('existing@example.com', 'wrongpassword');
      expect(user).toBeNull();
    });

    it('should return null if user does not exist', async () => {
      const user = await authService.validateUser('nonexisting@example.com', 'password123');
      expect(user).toBeNull();
    });
  });

  describe('login', () => {
    it('should return a login success message along with email and id', async () => {
      const user = { email: 'user@example.com', id: 'userId' };
      const result = await authService.login(user);
      expect(result).toEqual({
        message: "Login successful",
        email: 'user@example.com',
        id: 'userId',
      });
    });
  });
});
