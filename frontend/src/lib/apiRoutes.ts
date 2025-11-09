const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const API_VERSION = "v1";

const apiBase = `${BASE_URL}/api/${API_VERSION}`;

export const apiRoutes = {
  // Auth routes
  postLogin: `${apiBase}/auth/login`,
  postLogout: `${apiBase}/auth/logout`,

  //   postRegister: `${apiBase}/auth/register/`,
  getUserHomeData: `${apiBase}/auth/user/home`,
  getUserCheck: `${apiBase}/auth/check`,

  // Activities routes
  getAllActivitiesThumbnails: `${apiBase}/activities/thumbnails`,

  // SubActivity routes
  getActivityById: (id: string) =>
    `${apiBase}/activities/activity/${encodeURIComponent(id)}`,
  getActivityBySlug: (slug: string) =>
    `${apiBase}/activities/activity/slug/${encodeURIComponent(slug)}`,
  // You can add other resource routes here
  // e.g., users, products, etc.
  getAllUsers: `${apiBase}/users`,

  // Daily Routes
  getMyDailyEvents: `${apiBase}/calendar/daily`,

  getMyEveryDailyEvents(date: string) {
    return `${apiBase}/calendar/daily/${date}`;
  },

  // Monthly Routes
  getMyMonthlyEvents: `${apiBase}/calendar/monthly`,

  getMyEveryMonthlyEvents(date: string) {
    return `${apiBase}/calendar/mothly/${date}`;
  },


  // Add activity to my life
  addActivityToMyLife: `${apiBase}/student-activities`,

  // You can add other resource routes here
  // e.g., users, products, etc.
};
