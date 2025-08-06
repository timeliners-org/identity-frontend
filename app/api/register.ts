import type { RegisterResponse } from "~/api/schema";
import { useAPIClient } from "~/composables/useAPIFetch";

export default async function registerUser(email: string, username: string, password: string): Promise<RegisterResponse> {
  try {
    const data = await useAPIClient<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: { email, username, password },
    });
    return data;
  } catch (error) {
    console.error('registerUser error:', error);
    throw error; // Re-throw the error for further handling
  }
}