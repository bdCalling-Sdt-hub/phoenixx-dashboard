import { api } from "../api/baseApi";

const subCategorySlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createSubCategory: builder.mutation({
      query: (categoryData) => {
        return {
          url: "/subcategories/create-subcategory",
          method: "POST",
          body: categoryData,
        };
      },
      invalidatesTags: ["SubCategory"],
    }),
    updateSubCategory: builder.mutation({
      query: ({ id, updatedData }) => {
        return {
          url: `/subcategories/${id}`,
          method: "PATCH",
          body: updatedData,
        };
      },
      invalidatesTags: ["SubCategory"],
    }),
    deleteSubCategory: builder.mutation({
      query: (id) => {
        return {
          url: `/subcategories/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["SubCategory"],
    }),
    getSubCategories: builder.query({
      query: () => {
        return {
          url: "/subcategories",
          method: "GET",
        };
      },
      providesTags: ["SubCategory"],
    }),
    getSubCategoriesByCatID: builder.query({
      query: (catID) => {
        return {
          url: `/subcategories/subcategories-by-category/${catID}`,
          method: "GET",
        };
      },
      providesTags: ["SubCategory"],
    }),
  }),
});

export const {
  useGetSubCategoriesQuery,
  useGetSubCategoriesByCatIDQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = subCategorySlice;
