import React, { useEffect, useState } from "react";
import { Select } from "antd";
import useFetch from "../../useFetch/useFetch";
import handleApiRequest from "../../helpers/handleApiRequest";
import toast from "react-hot-toast";
export default function FilterMenuByCategory() {
  let [categories, setCategories] = useState([]);

  const { data, laoding } = useFetch(`/category`, {});

  useEffect(() => {
    if (data?.result) {
      const newCategories = data.result.map((item) => ({
        value: item.name,
        label: item.name,
      }));
      setCategories(newCategories);
    }
  }, [data]);

  const handleChange = async (value) => {
    console.log(`selected ${value}`);

    const { result, loading } = await handleApiRequest(
      `/menu/filter-category?category=${value}`,
      {}
    );

    console.log(result);

    if(!result?.success){
      toast.error(result?.message);
    }
  };

  return (
    <>
      <Select
        defaultValue="Filter category"
        style={{ width: 120 }}
        onChange={handleChange}
        options={categories}
      />
    </>
  );
}
