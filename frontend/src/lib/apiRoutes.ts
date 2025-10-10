const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const API_VERSION = "v1";

export const apiRoutes = {
  // Auth routes
  postLogin: `${BASE_URL}/api/${API_VERSION}/auth/login/`,
  postLogout: `${BASE_URL}/api/${API_VERSION}/auth/logout/`,
  //   postRegister: `${BASE_URL}/api/${API_VERSION}/auth/register/`,

  getUserHomeData: `${BASE_URL}/api/${API_VERSION}/auth/user/home/`,
  getUserCheck: `${BASE_URL}/api/${API_VERSION}/auth/check/`,

  // Activities routes
  getAllActivities: `${BASE_URL}/api/${API_VERSION}/activities/`,
  getAllActivitiesThumbnails: `${BASE_URL}/api/${API_VERSION}/activities/thumbnails/`,

  // You can add other resource routes here
  // e.g., users, products, etc.
  getAllUsers: `${BASE_URL}/api/${API_VERSION}/users/`,
};
