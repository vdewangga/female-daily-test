import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.APP_HOST,
});

export const apiSlice = createApi({
  baseQuery: baseQuery,
  endpoints: (builder) => ({}),
  tagTypes: ["Products"],
});

export const { endpoints, reducerPath, reducer, middleware } = apiSlice;
