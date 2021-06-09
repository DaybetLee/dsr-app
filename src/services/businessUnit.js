import http from "./httpService";
import { apiUrl } from "../config.json";
import { toast } from "react-toastify";

const apiEndpoint = apiUrl + "/businessunit";

export function saveBusinessUnit(businessUnit) {
  toast.info(`Saving Business Unit...`);
  const body = { ...businessUnit };
  delete body._id;
  if (businessUnit._id) {
    return http.put(apiEndpoint + "/" + businessUnit._id, body);
  }

  return http.post(apiEndpoint, body);
}

export function deleteBusinessUnit(id) {
  return http.delete(`${apiEndpoint}/${id}`);
}

export function getBusinessUnits() {
  return http.get(`${apiEndpoint}`);
}

export function getBusinessUnit(id) {
  return http.get(`${apiEndpoint}/${id}`);
}
