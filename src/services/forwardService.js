import http from "./httpService";
import { apiUrl } from "../config.json";
import { toast } from "react-toastify";

const apiEndpoint = apiUrl + "/forward";

export function forwardReport(id, email) {
  toast.info(`Sending Email...`);
  return http.post(`${apiEndpoint}/${id}`, email);
}
