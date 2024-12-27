import React, { useState } from "react";
import { Button, message, Popconfirm } from "antd";
import handleApiRequest from "../helpers/handleApiRequest";
import { toast } from "react-toastify";

export default function DeleteOrderButton({ order, getOrders }) {
  const confirm = async (e) => {
    console.log(e);
    message.success("Click on Yes");
    console.log("order id is: ", order._id);

    const { result, loading } = await handleApiRequest(
      `/admin/order/delete-order?id=${order._id}`,
      {
        method: "DELETE",
      }
    );

    if (result?.success) {
      getOrders();
      toast(result?.message);
    }
  };
  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
  };

  return (
    <div className="my-4">
      <Popconfirm
        title="Delete the task"
        description="Are you sure to delete this task?"
        onConfirm={confirm}
        onCancel={cancel}
        okText="Yes"
        cancelText="No"
      >
        <Button danger>Delete</Button>
      </Popconfirm>
    </div>
  );
}
