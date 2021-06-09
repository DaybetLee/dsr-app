import http from "./httpService";
import { apiUrl } from "../config.json";
import { toast } from "react-toastify";

const apiEndpoint = apiUrl + "/productvendor";

export function saveProductVendor(productVendor) {
  toast.info(`Saving Product Vendor...`);
  const body = { ...productVendor };
  delete body._id;
  if (productVendor._id) {
    return http.put(apiEndpoint + "/" + productVendor._id, body);
  }

  return http.post(apiEndpoint, body);
}

export function deleteProductVendor(id) {
  return http.delete(`${apiEndpoint}/${id}`);
}

export function getProductVendors() {
  return http.get(`${apiEndpoint}`);
}

export function getProductVendor(id) {
  return http.get(`${apiEndpoint}/${id}`);
}
