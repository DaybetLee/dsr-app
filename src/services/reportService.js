import http from "./httpService";
import { apiUrl } from "../config.json";
import { toast } from "react-toastify";

const apiEndpoint = apiUrl + "/report";

export function getServiceReports(searchQuery = " ") {
  return http.get(`${apiEndpoint}/?search=${searchQuery}`);
}

export function getMyServiceReport() {
  return http.get(`${apiEndpoint}/me`);
}

export function getServiceReport(id) {
  return http.get(`${apiEndpoint}/${id}`);
}

export function saveServiceReport(report) {
  toast.info(`Submitting Report...`);

  // if (report._id) {
  //   const body = { ...report };
  //   delete body._id;
  //   return http.put(apiEndpoint + "/" + report._id, body);
  // }
  return http.post(apiEndpoint, report);
}
