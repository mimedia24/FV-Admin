import { Card } from "antd";
import React from "react";

export default function CategoryCard({ category }) {
  return (
    <Card
      style={{
        width: 350,
      }}
    >
      <div>
        <img src={category?.thumbnails} alt="thumnail" className="w-20 h-20 rounded-full object-cover border" />
      </div>
      <h1>{category?.name}</h1>
      <h1>Description: {category?.description}</h1>
    </Card>
  );
}
