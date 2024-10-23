import React, { useEffect, useState } from "react";
import Layout from "./layout";
import useFetch from "../useFetch/useFetch";
import CustomSkeleton from "../components/skeleton";
import UserCard from "../components/user/userCard";
import { Input } from "antd";
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

  const onSearch = (value, _e, info) => console.log(info?.source, value);

  const { data, loading } = useFetch("/admin/list-of-users", {});

  useEffect(() => {
    setUser(data?.users);
  }, [data]);

  return (
    <Layout>
      <div>
        <h1 className="text-4xl text-center text-gray-500 mt-8">
          User Management
        </h1>
        <h1 className="text-2xl text-gray-500 text-center mt-9">
          All user list
        </h1>

        <div className="w-4/5 mx-auto my-4">
          <Search
            placeholder="search user by phone"
            allowClear
            enterButton="Search"
            size="medium"
            onSearch={onSearch}
          />
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

        <div className="w-fit mx-auto mt-12">
          {loading ? <CustomSkeleton /> : null}
        </div>
      </div>
    </Layout>
  );
}
