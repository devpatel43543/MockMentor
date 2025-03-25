import { jwtDecode } from "jwt-decode";

export const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.userId; // Ensure userId exists in your JWT payload
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
