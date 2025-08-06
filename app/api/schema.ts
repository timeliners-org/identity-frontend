import type { ProfileUser } from "~/utils/types";

export interface GetUserIDResponse {
  message: string;
  userId: string;
}

export interface LoginResponse {
  "message": string,
  "user": ProfileUser,
  "tokens": {
    "accessToken": string,
    "refreshToken": string,
    "expiresIn": number
  }
}

export interface ProfileResponse {
  "user": ProfileUser
}

export interface RegisterResponse {
  "id": string,
  "email": string,
  "username": string,
  "message": string
}

export interface RefreshTokenResponse {
  "message": string,
  "tokens": {
    "accessToken": string,
    "refreshToken": string,
    "expiresIn": number
  }
}