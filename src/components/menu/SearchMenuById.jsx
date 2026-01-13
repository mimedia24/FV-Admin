import Search from "antd/es/input/Search";
import React from "react";

function SearchMenuById({ onSearch }) {
  return (
    <Search
      placeholder="input menu id"
      allowClear
      enterButton="Search"
      size="large"
      onSearch={onSearch}
    />
  );
}

export default SearchMenuById;
