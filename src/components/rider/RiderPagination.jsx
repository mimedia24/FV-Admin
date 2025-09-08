import React from "react";
import { Pagination } from "antd";
const RiderPagination = ({ setPage, totalPage }) => {
  console.log("total pages : ", totalPage);

  return (
    <Pagination
      defaultCurrent={1}
      total={totalPage * 10}
      onChange={(pageNumber) => setPage(pageNumber)}
    />
  );
};
export default RiderPagination;
