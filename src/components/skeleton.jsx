import React from "react";
import { Skeleton } from "antd";
import { RotatingLines } from "react-loader-spinner";
export default function CustomSkeleton() {
  return <RotatingLines strokeColor="#3b82f6" height="30" width="30" />;
}
