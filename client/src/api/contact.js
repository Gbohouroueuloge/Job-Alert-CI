import api from "./axiosInstance";


const API_URL = "/api/contact";

const createContact = async(data) => {
  const response = await api.post(API_URL, data)
  return response.data
}

export default {
  createContact
}