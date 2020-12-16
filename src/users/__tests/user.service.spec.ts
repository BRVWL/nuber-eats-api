import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/services/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { Verification } from '../entities/verification.entity';
import { UserService } from '../services/user.service';

const createMockRepository = () => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

const mockMailService = {
  sendVerificationEmail: jest.fn(),
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('User service', () => {
  let service: UserService;
  let userRepository: MockRepository<User>;
  let verificationRepository: MockRepository<Verification>;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Verification),
          useValue: createMockRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
    verificationRepository = module.get(getRepositoryToken(Verification));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should fail', () => {
      //
    });
  });

  it.todo('getAll');

  describe('createUser', () => {
    const createUserArgs = {
      email: 'mail@mail.com',
      password: '12345678',
      role: UserRole.client,
    };
    const mockUser = { id: 1, ...createUserArgs };
    const mockCreateVerification = { code: '11111111' };
    const mockVerification = { id: 1, ...mockCreateVerification };

    it('should fail if user exists', async () => {
      // mock response from repository
      // it will return existing user
      userRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'mail@mail.com',
      });
      const result = await service.createUser(createUserArgs);
      expect(result).toMatchObject({
        ok: false,
        user: null,
        error: 'User already exists',
      });
    });
    it('should create new user', async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      userRepository.create.mockResolvedValue(createUserArgs);
      userRepository.save.mockResolvedValue(mockUser);
      verificationRepository.create.mockResolvedValue(mockCreateVerification);
      verificationRepository.save.mockResolvedValue(mockVerification);

      const result = await service.createUser(createUserArgs);
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledWith(createUserArgs);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(createUserArgs);
      expect(verificationRepository.create).toHaveBeenCalledTimes(1);
      expect(verificationRepository.create).toHaveBeenCalledWith({
        user: mockUser,
      });
      expect(verificationRepository.save).toHaveBeenCalledTimes(1);
      expect(verificationRepository.save).toHaveBeenCalledWith(
        mockCreateVerification,
      );
      expect(result).toMatchObject({
        ok: true,
        user: mockUser,
        error: null,
      });
    });
    it('should fail on exception', async () => {
      userRepository.findOne.mockRejectedValue('Can not create a user');
      const result = await service.createUser(createUserArgs);
      expect(result).toEqual({
        ok: false,
        user: null,
        error: 'Can not create a user',
      });
    });
  });
  it.todo('updateUser');
  it.todo('verifyEmail');
  it.todo('login');
});
