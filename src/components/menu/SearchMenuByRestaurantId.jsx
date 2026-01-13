import Search from "antd/es/input/Search";
import React from "react";

const SearchMenuByRestaurantId = ({ onSearch }) => {
  return (
    <Search
      placeholder="input restaurant id"
      allowClear
      enterButton="Search"
      size="large"
      onSearch={onSearch}
    />
  );
};

export default SearchMenuByRestaurantId;
