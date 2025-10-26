const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const API_VERSION = "v1";

const apiBase = `${BASE_URL}/api/${API_VERSION}`;

export const apiRoutes = {
  // Auth routes
  postLogin: `${BASE_URL}/api/${API_VERSION}/auth/login`,
  postLogout: `${BASE_URL}/api/${API_VERSION}/auth/logout`,
  //   postRegister: `${BASE_URL}/api/${API_VERSION}/auth/register/`,

  getUserHomeData: `${BASE_URL}/api/${API_VERSION}/auth/user/home`,
  getUserCheck: `${BASE_URL}/api/${API_VERSION}/auth/check`,

  // Activities routes
  getAllActivitiesThumbnails: `${BASE_URL}/api/${API_VERSION}/activities/thumbnails`,

  // SubActivity routes
  getAllActivities: `${BASE_URL}/api/${API_VERSION}/activities/activity/`,
  getActivityById(id: string) {
  return `${apiBase}/activities/activity/${encodeURIComponent(id)}`;
  },
  // You can add other resource routes here
  // e.g., users, products, etc.
  getAllUsers: `${BASE_URL}/api/${API_VERSION}/users`,
};

