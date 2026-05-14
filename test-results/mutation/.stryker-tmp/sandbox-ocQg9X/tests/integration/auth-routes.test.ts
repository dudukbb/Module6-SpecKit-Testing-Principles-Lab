// @ts-nocheck
import request from "supertest";

jest.mock("../../src/services/auth-service", () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
}));

import { createApp } from "../../src/app";
import { loginUser, registerUser } from "../../src/services/auth-service";

const mockedRegisterUser = registerUser as jest.MockedFunction<typeof registerUser>;
const mockedLoginUser = loginUser as jest.MockedFunction<typeof loginUser>;

describe("auth routes integration", () => {
  const app = createApp();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 201 with user and auth metadata on successful registration", async () => {
    // Arrange
    mockedRegisterUser.mockResolvedValueOnce({
      accessToken: "token-register",
      tokenType: "Bearer",
      expiresIn: "1h",
      user: {
        userId: "u-100",
        email: "new@example.com",
        displayName: "New User",
        createdAt: "2026-05-14T12:00:00.000Z",
      },
    });

    // Act
    const response = await request(app).post("/api/v1/auth/register").send({
      email: "new@example.com",
      displayName: "New User",
      password: "Password123",
    });

    // Assert
    expect(response.status).toBe(201);
    expect(mockedRegisterUser).toHaveBeenCalledWith({
      email: "new@example.com",
      displayName: "New User",
      password: "Password123",
    });
    expect(response.body).toEqual({
      data: {
        userId: "u-100",
        email: "new@example.com",
        displayName: "New User",
        createdAt: "2026-05-14T12:00:00.000Z",
      },
      meta: {
        tokenType: "Bearer",
        expiresIn: "1h",
        accessToken: "token-register",
      },
    });
  });

  it("should return 400 when registration payload is invalid", async () => {
    // Arrange
    const invalidPayload = {
      email: "not-an-email",
      displayName: "",
      password: "short",
    };

    // Act
    const response = await request(app).post("/api/v1/auth/register").send(invalidPayload);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("HTTP_400");
    expect(response.body.error.message.toLowerCase()).toContain("email");
    expect(mockedRegisterUser).not.toHaveBeenCalled();
  });

  it("should return login token payload when credentials are valid", async () => {
    // Arrange
    mockedLoginUser.mockResolvedValueOnce({
      accessToken: "token-login",
      tokenType: "Bearer",
      expiresIn: "1h",
      user: {
        userId: "u-101",
        email: "valid@example.com",
        displayName: "Valid User",
      },
    });

    // Act
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "valid@example.com",
      password: "Password123",
    });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        accessToken: "token-login",
        tokenType: "Bearer",
        expiresIn: "1h",
        user: {
          userId: "u-101",
          email: "valid@example.com",
          displayName: "Valid User",
        },
      },
    });
  });

  it("should return 204 on logout", async () => {
    // Arrange

    // Act
    const response = await request(app).post("/api/v1/auth/logout").send({});

    // Assert
    expect(response.status).toBe(204);
    expect(response.text).toBe("");
  });
});
