const API_URL = import.meta.env.VITE_API_URL;
export const authEndpoints = {
    SIGNUP_ROUTE: API_URL + "/api/auth/signup",
    GET_LOGIN_ROUTE: API_URL + "/api/auth/signin",
    LOGOUT_ROUTE: API_URL + "/api/auth/signout",
    GET_USER_ROUTE: API_URL + "/api/auth/get-user",
}

export const itineraryEndpoints = {
    GENERATE_ITINERARY: API_URL + "/api/itineraries",
    GET_ITINERARIES: API_URL + "/api/itineraries",
    GET_ITINERARY_DETAILS: (id) => `${API_URL}/api/itineraries/${id}`,
    TOGGLE_SHARE: (id) => `${API_URL}/api/itineraries/${id}/share`,
    GET_SHARED_ITINERARY: (token) => `${API_URL}/api/itineraries/share/${token}`,
    DELETE_ITINERARY: (id) => `${API_URL}/api/itineraries/${id}`,
}
