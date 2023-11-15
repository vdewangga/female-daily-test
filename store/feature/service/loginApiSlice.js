import { apiSlice } from "../api/apiSlice";

export const loginApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    postLogin: builder.mutation({
      query: (body) => {
        return {
          url: `/api/v1/login`,
          method: "POST",
          body,
        };
      },
    }),
    postLogout: builder.mutation({
      query: (body) => {
        return {
          url: `/api/v1/logout`,
          method: "POST",
          body,
        };
      },
    }),
    getProfile: builder.query({
      query: (_args) => `/api/v1/user`,
    }),
  }),
});

export const {
  usePostLoginMutation,
  usePostLogoutMutation,
  useGetProfileQuery,
} = loginApiSlice;
