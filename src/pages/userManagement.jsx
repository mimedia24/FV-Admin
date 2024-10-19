import React, { useEffect, useState } from "react";
import Layout from "./layout";
import useFetch from "../useFetch/useFetch";
import CustomSkeleton from "../components/skeleton";
import UserCard from "../components/user/userCard";

export default function UserManagement() {
  const [user, setUser] = useState(null);

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

        <div className="w-fit mx-auto mt-12">
          {loading ? <CustomSkeleton /> : null}
        </div>

        <div className="flex items-center flex-wrap gap-8 justify-center  ">
          {user && user.length > 0 ? (
            user.map((user) => <UserCard detail={user} key={user?._id}/>)
          ) : (
            <h1> No users found.</h1>
          )}
        </div>
      </div>
    </Layout>
  );
}
