import React from "react";
import { DownOutlined } from "@ant-design/icons";
import { Tree, Spin, Alert } from "antd";
import { useCategoryQuery } from "../../../redux/apiSlices/categoryApi";
import { useGetSubCategoriesQuery } from "../../../redux/apiSlices/subCategoryApi";

function CategoryList() {
  const { data: categoryData, isLoading, isError } = useCategoryQuery();
  const { data: subCategoryData } = useGetSubCategoriesQuery();

  const onSelect = (selectedKeys, info) => {
    console.log("Selected keys:", selectedKeys);
    console.log("Selected node info:", info);
  };

  const buildTreeData = (categories, subCategories) => {
    if (!Array.isArray(categories)) return [];

    return categories.map((catWrapper) => {
      const category = catWrapper.category;
      const catId = category._id;

      const children = subCategories
        .filter((sub) => sub.categoryId === catId)
        .map((sub) => ({
          title: sub.name,
          key: `sub-${sub._id}`,
        }));

      return {
        title: category.name,
        key: `cat-${catId}`,
        children,
      };
    });
  };

  if (isLoading) return <Spin className="p-4" tip="Loading categories..." />;
  if (isError)
    return <Alert type="error" message="Failed to load categories" />;

  const categories = categoryData?.data?.result || [];
  const subCategories = subCategoryData?.data?.result || [];

  const treeData = buildTreeData(categories, subCategories);

  return (
    <div className="w-1/2">
      <Tree
        showLine
        switcherIcon={<DownOutlined />}
        defaultExpandedKeys={[treeData[0]?.key]}
        onSelect={onSelect}
        treeData={treeData}
        className="p-4"
      />
    </div>
  );
}

export default CategoryList;
