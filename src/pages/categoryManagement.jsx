import React, { useEffect } from "react";
import Layout from "./layout";
import useFetch from "../useFetch/useFetch";
import CustomSkeleton from "../components/skeleton";
import CategoryCard from "../components/category/CategoryCard";
import AddCategoryModal from "../components/category/AddCategoryModal";

export default function CategoryManagement() {
  const [categories, setCategories] = React.useState(null);

  const { data, loading } = useFetch(`/category`, {});

  useEffect(() => {
    console.log(data);
    setCategories(data?.result);
  }, [data]);

  return (
    <Layout>
      <div>
        <h1 className="text-center mt-8 text-3xl text-gray-500">
          Category list
        </h1>
      </div>

      <div className="w-full flex items-center justify-center mt-5">
        <AddCategoryModal setCategories={setCategories} />
      </div>

      <div className="w-full flex items-center justify-center mt-5">
        {loading ? <CustomSkeleton /> : null}
      </div>

      <div className="flex p-8 flex-wrap items-center justify-center gap-8 ">
        {categories &&
          categories.map((category) => (
            <CategoryCard
              key={category._id}
              category={category}
              setCategories={setCategories}
            />
          ))}
      </div>
    </Layout>
  );
}
