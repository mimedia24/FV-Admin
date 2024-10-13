import React from "react";
import { Pagination } from "antd";
import handleApiRequest from "../helpers/handleApiRequest";
export default function PaginationContainer({ setOrders, orders }) {
  async function handleChange(page) {
    console.log("page is : ", page);
    setOrders(null);
    const {result} = await handleApiRequest(
      `/admin/list-of-orders?page=${page}&limit=15`,
      {}
    );

    console.log(result)
    if (result.orders) {
      setOrders(result);
    }
  }

  return <Pagination onChange={handleChange} defaultCurrent={1} total={50} />;
}
