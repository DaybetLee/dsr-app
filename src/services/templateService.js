import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/template";

export function findTemplate(id) {
  return http.get(`${apiEndpoint}/${id}`);
}

export function getTemplate() {
  return http.get(`${apiEndpoint}/me`);
}

export function deleteTemplate(obj) {
  if (obj.id) return http.delete(`${apiEndpoint}/?id=${obj.id}`);
  return http.delete(`${apiEndpoint}/?user=${obj.user}`);
}

export function createTemplate(template) {
  if (template._id) {
    const body = { ...template };
    delete body._id;
    delete body.owner;
    delete body.activityTimeInMin;
    delete body.weekday;
    delete body.__v;

    return http.post(apiEndpoint, body);
  }
  return http.post(apiEndpoint, template);
}

export function updateTemplate(template) {
  const body = { ...template };
  delete body._id;
  return http.put(apiEndpoint + "/" + template._id, body);
}
