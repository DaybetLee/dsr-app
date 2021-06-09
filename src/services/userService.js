import http from "./httpService";
import { apiUrl } from "../config.json";
import { toast } from "react-toastify";

const apiEndpoint = apiUrl + "/user";

export function saveUser(user) {
  toast.info(`Saving User...`);
  if (user._id) {
    const body = { ...user };
    delete body._id;
    return http.put(apiEndpoint + "/" + user._id, body);
  }
  return http.post(apiEndpoint, user);
}

export function patchUser(id, prop, body) {
  return http.patch(`${apiEndpoint}/${id}/${prop}`, body);
}

export function deleteUser(id) {
  return http.delete(`${apiEndpoint}/${id}`);
}

export function getUser(id) {
  return http.get(`${apiEndpoint}/${id}`);
}

export function getUsers() {
  return http.get(`${apiEndpoint}/`);
}

export function getManagerUser() {
  return http.get(`${apiEndpoint}/manager`);
}

export function getMe() {
  return http.get(`${apiEndpoint}/me`);
}
