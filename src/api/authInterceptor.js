import axios from "axios";

// All API modules use Axios' default client. Handle an expired or invalid
// session once here instead of showing a request-specific error screen.
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if ((status === 401 || status === 403) && localStorage.getItem("userToken")) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userId");

      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  },
);
