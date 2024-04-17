import  secureLocalStorage  from  "react-secure-storage";
const storeToken = (value) => {
  if (value) {
    // console.log("Store Token")
    const { access, refresh } = value;
    secureLocalStorage.setItem("access_token", access);
    secureLocalStorage.setItem("refresh_token", refresh);
  }
};

const getToken = () => {
  let access_token = secureLocalStorage.getItem("access_token");
  let refresh_token = secureLocalStorage.getItem("refresh_token");
  return { access_token, refresh_token };
};

const removeToken = () => {
  secureLocalStorage.removeItem("access_token");
  secureLocalStorage.removeItem("refresh_token");
};

const storeMode = (value) => {
  if (value !== null && value !== undefined) {
    localStorage.setItem("mode", value); // Store the value directly
  }
};

const getMode = () => {
  let mode = localStorage.getItem("mode");
  return mode; // Return the value directly, not as an object
};

export { storeToken, getToken, removeToken, storeMode, getMode };
