// @ts-nocheck
import { HttpError } from "../../../src/middleware/error-handler";

jest.mock("../../../src/config/env", () => ({
  getEnv: () => ({
    bcryptSaltRounds: 12,
    jwtExpiresIn: "1h",
    jwtSecret: "test-secret",
  }),
}));

jest.mock("../../../src/repositories/user-repository", () => ({
  findUserByEmail: jest.fn(),
  createUser: jest.fn(),
}));

jest.mock("../../../src/utils/password", () => ({
  hashPassword: jest.fn(),
  verifyPassword: jest.fn(),
}));

jest.mock("../../../src/utils/jwt", () => ({
  signAuthToken: jest.fn(),
}));

import { registerUser, loginUser } from "../../../src/services/auth-service";
import { createUser, findUserByEmail } from "../../../src/repositories/user-repository";
import { hashPassword, verifyPassword } from "../../../src/utils/password";
import { signAuthToken } from "../../../src/utils/jwt";

const mockedFindUserByEmail = findUserByEmail as jest.MockedFunction<typeof findUserByEmail>;
const mockedCreateUser = createUser as jest.MockedFunction<typeof createUser>;
const mockedHashPassword = hashPassword as jest.MockedFunction<typeof hashPassword>;
const mockedVerifyPassword = verifyPassword as jest.MockedFunction<typeof verifyPassword>;
const mockedSignAuthToken = signAuthToken as jest.MockedFunction<typeof signAuthToken>;

describe("auth-service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should reject registration when email is already registered", async () => {
    // Arrange
    mockedFindUserByEmail.mockResolvedValueOnce({
      userId: "u-1",
      email: "existing@example.com",
      displayName: "Existing User",
      passwordHash: "hash",
      createdAt: "2026-05-14T09:00:00.000Z",
    });

    // Act + Assert
    await expect(
      registerUser({
        email: "existing@example.com",
        displayName: "Another User",
        password: "Password123",
      }),
    ).rejects.toEqual(new HttpError(409, "Email is already registered."));
  });

  it("should register a new user and return auth metadata", async () => {
    // Arrange
    mockedFindUserByEmail.mockResolvedValueOnce(null);
    mockedHashPassword.mockResolvedValueOnce("hashed-password");
    mockedCreateUser.mockResolvedValueOnce({
      userId: "u-2",
      email: "new@example.com",
      displayName: "New User",
      passwordHash: "hashed-password",
      createdAt: "2026-05-14T10:00:00.000Z",
    });
    mockedSignAuthToken.mockReturnValueOnce("signed-token");

    // Act
    const result = await registerUser({
      email: "new@example.com",
      displayName: "New User",
      password: "Password123",
    });

    // Assert
    expect(mockedHashPassword).toHaveBeenCalledWith("Password123", 12);
    expect(mockedCreateUser).toHaveBeenCalledWith({
      email: "new@example.com",
      displayName: "New User",
      passwordHash: "hashed-password",
    });
    expect(mockedSignAuthToken).toHaveBeenCalledWith({
      userId: "u-2",
      email: "new@example.com",
      displayName: "New User",
    });
    expect(result).toEqual({
      accessToken: "signed-token",
      tokenType: "Bearer",
      expiresIn: "1h",
      user: {
        userId: "u-2",
        email: "new@example.com",
        displayName: "New User",
        createdAt: "2026-05-14T10:00:00.000Z",
      },
    });
  });

  it("should reject login when user is not found", async () => {
    // Arrange
    mockedFindUserByEmail.mockResolvedValueOnce(null);

    // Act + Assert
    await expect(
      loginUser({
        email: "missing@example.com",
        password: "Password123",
      }),
    ).rejects.toEqual(new HttpError(401, "Invalid email or password."));
  });

  it("should reject login when password is invalid", async () => {
    // Arrange
    mockedFindUserByEmail.mockResolvedValueOnce({
      userId: "u-3",
      email: "valid@example.com",
      displayName: "Valid User",
      passwordHash: "hash",
      createdAt: "2026-05-14T11:00:00.000Z",
    });
    mockedVerifyPassword.mockResolvedValueOnce(false);

    // Act + Assert
    await expect(
      loginUser({
        email: "valid@example.com",
        password: "WrongPassword123",
      }),
    ).rejects.toEqual(new HttpError(401, "Invalid email or password."));
  });

  it("should return token payload on successful login", async () => {
    // Arrange
    mockedFindUserByEmail.mockResolvedValueOnce({
      userId: "u-4",
      email: "valid@example.com",
      displayName: "Valid User",
      passwordHash: "hash",
      createdAt: "2026-05-14T12:00:00.000Z",
    });
    mockedVerifyPassword.mockResolvedValueOnce(true);
    mockedSignAuthToken.mockReturnValueOnce("token-2");

    // Act
    const result = await loginUser({
      email: "valid@example.com",
      password: "Password123",
    });

    // Assert
    expect(mockedVerifyPassword).toHaveBeenCalledWith("Password123", "hash");
    expect(result).toEqual({
      accessToken: "token-2",
      tokenType: "Bearer",
      expiresIn: "1h",
      user: {
        userId: "u-4",
        email: "valid@example.com",
        displayName: "Valid User",
      },
    });
  });
});
