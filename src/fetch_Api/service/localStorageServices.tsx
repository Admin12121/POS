import  secureLocalStorage  from  "react-secure-storage";
interface Token {
  access: string;
  refresh: string;
}
const storeToken = (value: Token) => {
  if (value) {
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

export { storeToken, getToken, removeToken };
