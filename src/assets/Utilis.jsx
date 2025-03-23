export const Base_URL = import.meta.env.VITE_API_KEY; 

export const AuthToken = () => {
  return localStorage.getItem("token");
};
