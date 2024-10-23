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

        <div className="w-[90%] mx-auto overflow-scroll">
          <table className="w-full text-sm border">
            <thead>
              <th className="text-center px-2 py-1 border text-gray-400 min-w-24">
                Sl no
              </th>
              <th className="text-center px-2 py-1 border text-gray-400 min-w-24">
                ID
              </th>
              <th className="text-center px-2 py-1 border text-gray-400 min-w-24">
                Avater
              </th>
              <th className="text-center px-2 py-1 border text-gray-400 min-w-24">
                Status
              </th>
              <th className="text-center px-2 py-1 border text-gray-400 min-w-24">
                Name
              </th>
              <th className="text-center px-2 py-1 border text-gray-400 min-w-24">
                Email
              </th>
              <th className="text-center px-2 py-1 border text-gray-400 min-w-24">
                Phone
              </th>
              <th className="text-center px-2 py-1 border text-gray-400 min-w-24">
                Home
              </th>
              <th className="text-center px-2 py-1 border text-gray-400 min-w-24">
                Office
              </th>
              <th className="text-center px-2 py-1 border text-gray-400 min-w-24">
                Others
              </th>
              <th className="text-center px-2 py-1 border text-gray-400 min-w-24">
                Action
              </th>
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
