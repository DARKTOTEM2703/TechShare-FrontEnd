import { loginUser, validateToken } from "@/services/Auth/AuthService.js";

export const authenticateUser = async (input:any) => {
  try {
    const { token } = await loginUser(input.email, input.password);

    if (!token) {
      throw new Error("Token missing from login response");
    }

    const validationResponse = await validateToken(token);

    if (!validationResponse.isValid) {
      throw new Error("Invalid or expired token");
    }

    return {
      token,
      decoded: validationResponse.decoded,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Authentication error:", error.message);
      throw new Error(error.message || "Error during authentication");
    } else {
      console.error("Authentication error:", error);
      throw new Error("Error during authentication");
    }
  }
};