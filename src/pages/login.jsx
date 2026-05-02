import React from "react";
import { Button, Form, Input } from "antd";
import { apiAuthToken, apiPath } from "../../secrets";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../useAuth/useAuth";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

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

      if (
        result.result === "Invalid credentials." ||
        result.message === "Invalid credentials." ||
        result.success === false
      ) {
        toast.error(
          result.result || result.message || "Invalid login credentials."
        );
        return;
      }

      if (result?.accessToken) {
        setAdmin(true);
        Cookies.set("accessToken", result.accessToken);
        localStorage.setItem("id", result.id);
        localStorage.setItem("AccessToken", result.accessToken);
        toast.success("Login successful");
        navigate("/dashboard");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error. Server is down.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.25),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.22),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#0f172a_35%,_#111827_100%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />

      {/* Floating glow */}
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:grid-cols-2">
          {/* Left hero */}
          <div className="hidden flex-col justify-between border-r border-white/10 bg-gradient-to-br from-blue-600/20 via-cyan-500/10 to-transparent p-10 lg:flex">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-blue-100">
                <Sparkles size={14} />
                Food Verse Main Admin
              </div>

              <h1 className="mt-8 max-w-md text-5xl font-black leading-[1.05] tracking-tight text-white">
                Smart control for restaurants, orders and operations.
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-slate-200/90">
                Powerful admin access for monitoring growth, controlling vendors,
                managing live operations and keeping the platform sharp in real
                time.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90">
                  Real-time Control
                </span>
                <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90">
                  Secure Access
                </span>
                <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90">
                  Aggressive UI
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-300">
                  Access
                </p>
                <h3 className="mt-2 text-2xl font-black text-white">Admin</h3>
                <p className="mt-1 text-sm text-slate-300">Protected panel</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-300">
                  Security
                </p>
                <h3 className="mt-2 text-2xl font-black text-white">Live</h3>
                <p className="mt-1 text-sm text-slate-300">Token based auth</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-300">
                  Status
                </p>
                <h3 className="mt-2 text-2xl font-black text-white">Ready</h3>
                <p className="mt-1 text-sm text-slate-300">Dashboard access</p>
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className="flex items-center justify-center bg-white px-5 py-8 sm:px-8 md:px-10">
            <div className="w-full max-w-md">
              <div className="mb-8 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30">
                  <ShieldCheck size={36} strokeWidth={2.3} />
                </div>

                <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.28em] text-blue-600">
                  Secure Admin Access
                </p>

                <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
                  Welcome Back
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Sign in to your admin account and continue controlling Food
                  Verse operations.
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
                  label={
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                      Email Address
                    </span>
                  }
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
                    prefix={<Mail size={16} className="text-slate-400" />}
                    className="!h-12 !rounded-2xl !border-slate-200 !bg-slate-50 !text-base"
                    placeholder="admin@example.com"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                      Password
                    </span>
                  }
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
                    prefix={<Lock size={16} className="text-slate-400" />}
                    className="!h-12 !rounded-2xl !border-slate-200 !bg-slate-50 !text-base"
                    placeholder="••••••••"
                  />
                </Form.Item>

                <Form.Item className="mb-0 mt-6">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="!h-12 !w-full !rounded-2xl !border-0 !bg-gradient-to-r !from-blue-600 !to-cyan-500 !text-base !font-bold shadow-lg shadow-blue-500/30 hover:!from-blue-700 hover:!to-cyan-600"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Log In
                      <ArrowRight size={18} />
                    </span>
                  </Button>
                </Form.Item>
              </Form>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-xs font-medium text-slate-500">
                Authorized admin access only. All actions are monitored for
                operational security.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}