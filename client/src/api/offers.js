import api from "./axiosInstance"

const API_URL = "/api/offers";

const cleanParams = (params = {}) => {
  return Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== null && params[key] !== "")
    .reduce((acc, key) => {
      const value = params[key]
      if (value instanceof Set) {
        acc[key] = [...value].join(",")
      } else if (Array.isArray(value)) {
        acc[key] = value.join(",")
      } else {
        acc[key] = value
      }
      return acc;
    }, {});
};

const getOffers = async(params = {}) => {
  const response = await api.get(`${API_URL}`, { params: cleanParams(params) })
  return response.data
}

const getOfferById = async(id) => {
  const response = await api.get(`${API_URL}/${id}`)
  return response.data
}

const getOfferStats = async(params = {}) => {
  const response = await api.get(`${API_URL}/stats`, { params: cleanParams(params) })
  return response.data
}

const getOfferStatsByFiliere = async(params = {}) => {
  const response = await api.get(`${API_URL}/stats/by-filiere`, { params: cleanParams(params) })
  return response.data
}

const getOfferStatsBySource = async(params = {}) => {
  const response = await api.get(`${API_URL}/stats/by-source`, { params: cleanParams(params) })
  return response.data
}

export {
  getOffers,
  getOfferById,
  getOfferStats,
  getOfferStatsByFiliere,
  getOfferStatsBySource
}
