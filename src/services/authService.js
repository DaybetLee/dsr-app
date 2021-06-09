import jwtDecode from "jwt-decode";

import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/login";
const tokenKey = "token";

http.setJwt(getJwt());

export async function login(email, password) {
  const response = await http.post(apiEndpoint, { email, password });
  localStorage.setItem(tokenKey, response.headers["x-auth-token"]);
}

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

export function getCurrentUserToken() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}
