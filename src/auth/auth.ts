export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

  export const getToken = (): string | null => {
  return localStorage.getItem("token");
};
export const onLogout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("email");
};