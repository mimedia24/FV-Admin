import React, { useEffect, useState } from "react";
import Layout from "./layout";
import useFetch from "../useFetch/useFetch";
import CustomSkeleton from "../components/skeleton";
import UserCard from "../components/user/userCard";
import { Input } from "antd";
import Pagination from "../components/pagination/Pagination";
import axios from "axios";
import { apiAuthToken, apiPath } from "../../secrets";
const { Search } = Input;

const userTableHeading = [
  {
    title: "Sl no",
  },
  {
    title: "ID",
  },
  {
    title: "Avater",
  },
  {
    title: "Status",
  },
  {
    title: "Name",
  },
  {
    title: "Email",
  },
  {
    title: "Phone",
  },
  {
    title: "Home",
  },
  {
    title: "Office",
  },
  {
    title: "Others",
  },
  {
    title: "Action",
  },
];

export default function UserManagement() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState(1);

  async function handleSearchByPhone(phoneNumber) {
    try {
      const { data } = await axios.get(
        `${apiPath}/admin/search-user-by-phone-number?phoneNumber=${phoneNumber}`,
        {
          headers: {
            "x-auth-token": apiAuthToken,
          },
        }
      );

      if (data.success) {
        const userArr = [];
        userArr.push(data.user);
        setUser(userArr);
      }
    } catch (error) {
      console.log("search by phone errro : ", error);
    }
  }

  async function handleSearchByUserId(userId) {
    try {
      const { data } = await axios.get(
        `${apiPath}/admin/user/${userId}`,
        {
          headers: {
            "x-auth-token": apiAuthToken,
          },
        }
      );

      if (data.success) {
        const userArr = [];
        userArr.push(data.user);
        setUser(userArr);
      }
    } catch (error) {
      console.log("search by phone errro : ", error);
    }
  }

  function onSearchByUserId(value, e, info) {
    handleSearchByUserId(value);
  }

  const onSearch = (value, _e, info) => {
    //  console.log("value is : ", value);

    handleSearchByPhone(value);
  };

  const { data, loading } = useFetch(
    `/admin/list-of-users?page=${page}&limit=20`,
    {}
  );

  useEffect(() => {
    setUser(data?.users);
  }, [data]);

  useEffect(() => {
    console.log("users list is : ", user);
  }, [user]);

  return (
    <Layout>
      <div>
        <h1 className="text-4xl text-center text-gray-500 mt-8">
          User Management
        </h1>
        <h1 className="text-2xl text-gray-500 text-center mt-9">
          All user list
        </h1>

        <div className="flex items-center justify-center gap-8 w-4/5 mx-auto mt-5">
          <Search
            placeholder="search user by phone"
            allowClear
            enterButton="Search"
            size="medium"
            onSearch={onSearch}
            className="flex-1"
          />
          <Search
            placeholder="search user by user id"
            allowClear
            enterButton="user id"
            size="medium"
            onSearch={onSearchByUserId}
            className="flex-1"
          />
        </div>
        <div className="w-[90%] mx-auto my-2">
          <h1>page: {page}</h1>
        </div>

        <div className="w-[90%] mx-auto overflow-scroll">
          <table className="w-full text-sm border">
            <thead>
              {userTableHeading.map((title, index) => {
                return (
                  <th
                    key={index}
                    className="text-center px-2 py-1 border text-gray-400 min-w-24"
                  >
                    {title.title}
                  </th>
                );
              })}
            </thead>

            <tbody>
              {user && user.length > 0
                ? user.map((user, index) => (
                    <UserCard slNO={index} detail={user} key={user?._id} />
                  ))
                : null}
            </tbody>
          </table>
        </div>
        <Pagination updatePage={setPage} currentPage={page} />

        <div className="w-fit mx-auto mt-12">
          {loading ? <CustomSkeleton /> : null}
        </div>
      </div>
    </Layout>
  );
}
