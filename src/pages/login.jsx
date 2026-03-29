import React from "react";
import { Button, Form, Input } from "antd";
import { apiAuthToken, apiPath } from "../../secrets";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../useAuth/useAuth";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const onFinishFailed = (errorInfo) => {
  console.error("Failed:", errorInfo);
  toast.error("Please fill in all required fields.");
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
      if (result.result === "Invalid credentials.") {
        toast.error(result.result);
        return false;
      }

      if (result?.accessToken) {
        setAdmin(true);
        Cookies.set("accessToken", result.accessToken);
        localStorage.setItem("id", result.id);
        localStorage.setItem("AccessToken", result.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error. Server is down.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Admin Login
          </h1>
          <p className="text-gray-500 mt-2">
            Sign in to your admin account
          </p>
        </div>
        <Form
          name="login_form"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                type: "email",
                message: "The input is not a valid email!",
              },
            ]}
          >
            <Input
              className="h-10 text-base"
              placeholder="admin@example.com"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              {
                min: 6,
                message: "Password must be at least 6 digits!",
              },
            ]}
          >
            <Input.Password
              className="h-10 text-base"
              placeholder="••••••••"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-12 mt-4 text-lg font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors"
            >
              Log In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
