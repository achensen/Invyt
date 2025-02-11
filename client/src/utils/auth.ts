// Store token in local storage
export const setToken = (token: string) => {
    localStorage.setItem("id_token", token);
  };
  
  // Retrieve token from local storage
  export const getToken = () => {
    return localStorage.getItem("id_token");
  };
  
  // Remove token (logout function)
  export const removeToken = () => {
    localStorage.removeItem("id_token");
  };
  
  // Check if user is authenticated
  export const isAuthenticated = () => {
    return !!getToken();
  };  