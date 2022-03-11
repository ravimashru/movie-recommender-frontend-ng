export const endpoints = {
  USER: '/users',
  USER_MOVIES: (userId: string) => `/users/${userId}/movies`,
  USER_RECOMMENDATIONS: (userId: string) => `/users/${userId}/recommendations`,
};
