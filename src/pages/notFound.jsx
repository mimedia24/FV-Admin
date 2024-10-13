import React from "react";
import Layout from "./layout";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Layout>
      <div className="w-full h-[80vh] flex items-center justify-center flex-col">
        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
          404
        </h1>
        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
          Not Found
        </h1>
        <p className="text-2xl">
          Go to dashboard. <Link to={"/dashboard"} className="text-4xl bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent font-extrabold">Go</Link>
        </p>
      </div>
    </Layout>
  );
}
