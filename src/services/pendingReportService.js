import http from "./httpService";
import { apiUrl } from "../config.json";
import { toast } from "react-toastify";

const apiEndpoint = apiUrl + "/pending";

export function findPendingRequest(id) {
  return http.get(`${apiEndpoint}/${id}`);
}

export function getMyPendingRequest() {
  return http.get(`${apiEndpoint}/`);
}

export function deletePendingRequest(id) {
  return http.delete(`${apiEndpoint}/${id}`);
}

export function savePendingRequest(pending) {
  toast.info(`Saving Report...`);
  if (pending._id) {
    const body = { ...pending };
    delete body._id;

    return http.patch(`${apiEndpoint}/${pending._id}`, body);
  }
  return http.post(apiEndpoint, pending);
}

export function getMyRequest(deny = true) {
  return http.get(`${apiEndpoint}/me/${deny}`);
}

export function updateRejectMessage(id, body) {
  return http.patch(`${apiEndpoint}/${id}`, body);
}
