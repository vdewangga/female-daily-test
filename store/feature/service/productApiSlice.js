import { apiSlice } from "../api/apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (args) => {
        return {
          url: `/api/v1/products`,
          params: {
            ...args.parms,
          },
        };
      },
      providesTags: ["Products"],
    }),
    getDetailProducts: builder.query({
      query: (args) => `/api/v1/products/${args.id}`,
      providesTags: ["Products"],
    }),
    postProducts: builder.mutation({
      query: (body) => {
        return {
          url: `/api/v1/products`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation({
      query: (body) => {
        return {
          url: `/api/v1/products`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["Products"],
    }),
    deleteProduct: builder.mutation({
      query: (body) => {
        return {
          url: `/api/v1/products/${body.id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  usePostProductsMutation,
  useGetDetailProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApiSlice;
