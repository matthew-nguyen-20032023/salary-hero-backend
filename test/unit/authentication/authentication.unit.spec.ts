import * as bcrypt from "bcrypt";
import { Test } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { INestApplication } from "@nestjs/common";
import Modules from "src/modules";
import { UserRole } from "src/models/entities/user.entity";
import { mockRandomUser } from "test/mock/mock-user-entity";
import { AuthService } from "src/modules/authentication/auth.service";
import { AuthMessageFailed } from "src/modules/authentication/auth.const";

describe("Test Auth Service", () => {
  let app: INestApplication;
  let authService: AuthService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [...Modules],
      controllers: [],
      providers: [],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    authService = moduleRef.get(AuthService);
    jwtService = moduleRef.get(JwtService);

    // Reset all data
    await authService.userRepository.delete({});
  });

  describe("Test register, login, and refresh token", () => {
    const mockUserAdmin = mockRandomUser(UserRole.Admin);
    const mockUserPartner = mockRandomUser(UserRole.Partner);
    const mockUserWorker = mockRandomUser(UserRole.Worker);

    it("should register a admin user", async () => {
      const result = await authService.register(
        mockUserAdmin.username,
        mockUserAdmin.email,
        mockUserAdmin.password,
        mockUserAdmin.role,
        1
      );

      expect(result.username).toEqual(mockUserAdmin.username);
      expect(result.email).toEqual(mockUserAdmin.email);
      expect(result.role).toEqual(mockUserAdmin.role);
      const isPasswordMatch = await bcrypt.compare(
        mockUserAdmin.password,
        result.password
      );
      expect(isPasswordMatch).toBe(true);
    });

    it("should throw HttpException if user already exists", async () => {
      let errorMessage;
      try {
        await authService.register(
          mockUserAdmin.username,
          mockUserAdmin.email,
          mockUserAdmin.password,
          mockUserAdmin.role,
          1
        );
      } catch (error) {
        errorMessage = error.message;
      }
      expect(errorMessage).toBe(AuthMessageFailed.UserHasRegister);
    });

    it("should register a partner user", async () => {
      const result = await authService.register(
        mockUserPartner.username,
        mockUserPartner.email,
        mockUserPartner.password,
        mockUserPartner.role,
        1
      );

      expect(result.username).toEqual(mockUserPartner.username);
      expect(result.email).toEqual(mockUserPartner.email);
      expect(result.role).toEqual(mockUserPartner.role);
      const isPasswordMatch = await bcrypt.compare(
        mockUserPartner.password,
        result.password
      );
      expect(isPasswordMatch).toBe(true);
    });

    it("should register a worker user", async () => {
      const result = await authService.register(
        mockUserWorker.username,
        mockUserWorker.email,
        mockUserWorker.password,
        mockUserWorker.role,
        1
      );

      expect(result.username).toEqual(mockUserWorker.username);
      expect(result.email).toEqual(mockUserWorker.email);
      expect(result.role).toEqual(mockUserWorker.role);
      const isPasswordMatch = await bcrypt.compare(
        mockUserWorker.password,
        result.password
      );
      expect(isPasswordMatch).toBe(true);
    });

    it("should login a user successfully", async () => {
      // Login with username
      const resultLoginWithUsername = await authService.login(
        mockUserAdmin.username,
        mockUserAdmin.password
      );
      // Login with email
      const resultLoginWithEmail = await authService.login(
        mockUserAdmin.email,
        mockUserAdmin.password
      );

      expect(resultLoginWithUsername.refresh_token).toBeDefined();
      expect(resultLoginWithUsername.access_token).toBeDefined();
      expect(resultLoginWithEmail.refresh_token).toBeDefined();
      expect(resultLoginWithEmail.access_token).toBeDefined();
      // Verify token
      const verifyAccessToken = await jwtService.verifyAsync(
        resultLoginWithUsername.access_token
      );
      expect(verifyAccessToken.email).toBe(mockUserAdmin.email);
      // Verify refresh token
      const verifyRefreshToken = await jwtService.verifyAsync(
        resultLoginWithUsername.refresh_token,
        {
          secret: process.env.JWT_REFRESH_SECRET,
        }
      );
      expect(verifyRefreshToken.email).toBe(mockUserAdmin.email);
    });

    it("should throw HttpException if user invalid or wrong password or email", async () => {
      const identify = "nonexistentUser";
      const password = "nonexistentPassword";
      let result;
      try {
        await authService.login(identify, password);
      } catch (error) {
        result = error.message;
      }
      expect(result).toBe(AuthMessageFailed.UsernameOrPasswordIncorrect);
    });

    it("should create new token", async () => {
      const resultLoginWithUsername = await authService.login(
        mockUserAdmin.username,
        mockUserAdmin.password
      );
      const result = await authService.refreshToken(
        resultLoginWithUsername.refresh_token
      );
      expect(result.access_token).toBeDefined();
      const verifyToken = await jwtService.verifyAsync(result.access_token);
      expect(verifyToken.email).toBe(mockUserAdmin.email);
    });

    it("should throw error because invalid token refresh", async () => {
      const invalidRefreshToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImEiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.pX8MaSijRUH5tX5O-_ZnySmveCsFEOF_HbDBxZuviQ0";
      let result;
      try {
        await authService.refreshToken(invalidRefreshToken);
      } catch (error) {
        result = error.message;
      }
      expect(result).toBe(AuthMessageFailed.InvalidRefreshToken);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
