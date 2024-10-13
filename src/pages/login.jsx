import { Button, Form, Input } from "antd";
import { apiAuthToken, apiPath } from "../../secrets";
import { Navigate, redirect, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../useAuth/useAuth";
import { toast } from "react-toastify";

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

export default function Login() {
  const navigate = useNavigate();

  const { setAdmin } = useAuth();

  const onFinish = async (values) => {
    try {
      const apiResponse = await fetch(`${apiPath}/admin/login`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "x-auth-token": apiAuthToken,
        },
        credentials: "include",
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });
      const result = await apiResponse.json();

      if (result?.accessToken) {
        setAdmin(true);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
      toast("Network error. Server is down.");
      throw new Error(error);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="min-w-80 h-fit px-8 py-12 border-2 shadow-lg rounded-md">
        <h1 className="text-center my-4 text-3xl">Login as admin</h1>
        <Form
          name="basic"
          style={{
            maxWidth: "100%",
            minWidth: "100%",
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            style={{
              minWidth: "100%",
            }}
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input placeholder="admin@email.com" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password placeholder="password minimum 6 digits" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
