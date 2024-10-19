import React, { useState } from "react";
import { AudioOutlined } from "@ant-design/icons";
import { Input, Space } from "antd";
import handleApiRequest from "../helpers/handleApiRequest";
import { toast } from "react-toastify";
const { Search } = Input;
const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: "#1677ff",
    }}
  />
);

export default function SearchInput({
  inputType,
  searchType,
  setSearchResult,
}) {
  let [apiEndpoint, setApiEndpoint] = useState(false);

  const searchRider = async (value, _e, info) => {
    console.log(value);

    if (value.length <= 8) {
      toast("Please input correct id or phone number.");
      return false;
    }

    if (searchType === "phone") {
      apiEndpoint = `/admin/rider/search-rider?phone=${value}`;
    } else {
      apiEndpoint = `/admin/rider/search-rider?id=${value}`;
    }
    const { result, loading } = await handleApiRequest(apiEndpoint, {});

    if (result?.success) {
      setSearchResult(result);
    } else {
      toast(result?.message);
    }
  };

  return (
    <div>
      {inputType === "rider" ? (
        <Search
          placeholder="search rider by id or phone"
          onSearch={searchRider}
          style={{
            width: 200,
          }}
        />
      ) : null}
    </div>
  );
}
