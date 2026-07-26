import { useEffect, useMemo, useState } from "react";
import Layout from "./layout";
import axiosInstance from "../services/axios/axiosInstance";
import UpdateChargeForm from "../components/charges/UpdateChargeForm";
import PostScheduleCharge from "../components/charges/PostScheduleChargeForm";
import DeleteChargeList from "../components/charges/DeleteChargeList";
import {
  CarOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  ThunderboltOutlined,
  ReloadOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { Button, Empty } from "antd";

const statThemes = {
  blue: {
    iconBg: "bg-blue-500/10",
    iconText: "text-blue-600",
    border: "border-blue-200",
    glow: "shadow-[0_10px_40px_rgba(37,99,235,0.10)]",
  },
  emerald: {
    iconBg: "bg-emerald-500/10",
    iconText: "text-emerald-600",
    border: "border-emerald-200",
    glow: "shadow-[0_10px_40px_rgba(16,185,129,0.10)]",
  },
  amber: {
    iconBg: "bg-amber-500/10",
    iconText: "text-amber-600",
    border: "border-amber-200",
    glow: "shadow-[0_10px_40px_rgba(245,158,11,0.10)]",
  },
  violet: {
    iconBg: "bg-violet-500/10",
    iconText: "text-violet-600",
    border: "border-violet-200",
    glow: "shadow-[0_10px_40px_rgba(139,92,246,0.10)]",
  },
};

export default function Charges() {
  const [charges, setCharges] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getChargeList() {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/charges/schedule");

      setCharges(data.charges);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getChargeList();
  }, []);

  const totalCharges = charges?.length || 0;
  const activeCharges =
    charges?.filter((item) => item?.isActive)?.length || 0;

  const latestCharge = useMemo(() => {
    if (!charges || !charges.length) return null;
    return charges[0];
  }, [charges]);

  return (
    <Layout>
      <div className="mx-auto max-w-[1450px] px-4 py-6 md:px-6 md:py-8">
        {/* Header */}
        <div className="relative mb-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-white to-slate-50" />
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-200/50">
                <DollarOutlined className="text-[28px]" />
              </div>

              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.20em] text-slate-500">
                  <ThunderboltOutlined />
                  Delivery Charge Configuration
                </div>

                <h1 className="m-0 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                  Charges Management
                </h1>

                <p className="mt-2 text-sm text-slate-500 md:text-base">
                  Control rider and user kilometer-based delivery charges from
                  one clean settings panel.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                icon={<ReloadOutlined />}
                onClick={getChargeList}
                loading={loading}
                className="!h-11 !rounded-xl !border-slate-200 !text-slate-600 !font-semibold"
              >
                Refresh
              </Button>

              <div className="[&>button]:!h-11 [&>button]:!rounded-xl [&>button]:!px-6 [&>button]:!font-bold">
                <PostScheduleCharge />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<TagOutlined />}
            label="Total Charge Plans"
            value={totalCharges}
            helper="All configured charge schedules"
            color="blue"
          />
          <StatCard
            icon={<ThunderboltOutlined />}
            label="Active Plans"
            value={activeCharges}
            helper="Currently active charge rules"
            color="emerald"
          />
          <StatCard
            icon={<CarOutlined />}
            label="Rider First KM"
            value={latestCharge?.riderFirstKMCharge ?? 0}
            helper="Latest first kilometer rider charge"
            color="amber"
          />
          <StatCard
            icon={<EnvironmentOutlined />}
            label="User First KM"
            value={latestCharge?.userFirstKMCharge ?? 0}
            helper="Latest first kilometer user charge"
            color="violet"
          />
        </div>

        {/* Table Card */}
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-5 py-4 md:px-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="m-0 text-xl font-extrabold text-slate-900">
                  Charge Directory
                </h3>
                <p className="m-0 mt-1 text-sm text-slate-500">
                  Review rider and user kilometer charges, status and actions.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                  Plans: {totalCharges}
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                  Active: {activeCharges}
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto p-4 md:p-6">
            {!charges || charges.length === 0 ? (
              <div className="py-16">
                <Empty description="No charge schedule found" />
              </div>
            ) : (
              <table className="w-full min-w-[950px] overflow-hidden rounded-2xl border border-slate-200">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border-b border-slate-200 px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                      SL No
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                      Rider First KM
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                      Rider Others KM
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                      User First KM
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                      User Others KM
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                      Status
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3 text-center text-[12px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {charges.map((item, index) => (
                    <tr
                      key={index}
                      className="transition-colors hover:bg-slate-50/80"
                    >
                      <td className="border-b border-slate-100 px-4 py-4 text-sm font-semibold text-slate-700">
                        {index + 1}
                      </td>

                      <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-700">
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                          {item.riderFirstKMCharge}
                        </span>
                      </td>

                      <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-700">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                          {item.riderOthersKMCharge}
                        </span>
                      </td>

                      <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-700">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                          {item.userFirstKMCharge}
                        </span>
                      </td>

                      <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-700">
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                          {item.userOthersKMCharge}
                        </span>
                      </td>

                      <td className="border-b border-slate-100 px-4 py-4 text-sm">
                        {item.isActive ? (
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-600">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-rose-600">
                            Disabled
                          </span>
                        )}
                      </td>

                      <td className="border-b border-slate-100 px-4 py-4 text-sm">
                        <div className="flex items-center justify-center gap-2">
                          <div className="[&>button]:!rounded-xl">
                            <UpdateChargeForm item={item} />
                          </div>
                          <div className="[&>button]:!rounded-xl">
                            <DeleteChargeList item={item} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </Layout>
  );
}

const StatCard = ({ icon, label, value, helper, color = "blue" }) => {
  const theme = statThemes[color] || statThemes.blue;

  return (
    <div
      className={`rounded-[24px] border bg-white p-5 md:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${theme.border} ${theme.glow}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            {label}
          </div>
          <div className="text-3xl font-black leading-none text-slate-900">
            {value || 0}
          </div>
          <div className="mt-3 text-sm text-slate-500">{helper}</div>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${theme.iconBg} ${theme.iconText}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};
