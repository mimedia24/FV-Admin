import React, { useEffect, useMemo } from "react";
import Layout from "./layout";
import useFetch from "../useFetch/useFetch";
import CustomSkeleton from "../components/skeleton";
import CategoryCard from "../components/category/CategoryCard";
import AddCategoryModal from "../components/category/AddCategoryModal";
import {
  AppstoreOutlined,
  TagsOutlined,
  ThunderboltOutlined,
  ReloadOutlined,
  FolderOpenOutlined,
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
};

export default function CategoryManagement() {
  const [categories, setCategories] = React.useState(null);

  const { data, loading } = useFetch(`/category/all`, {});

  useEffect(() => {
    console.log(data);
    setCategories(data?.result);
  }, [data]);

  const totalCategories = categories?.length || 0;
  const pageStateLabel = useMemo(() => {
    if (loading) return "Loading categories";
    if (!categories || categories.length === 0) return "No category found";
    return "Category list ready";
  }, [loading, categories]);

  return (
    <Layout>
      <div className="mx-auto max-w-[1450px] px-4 py-6 md:px-6 md:py-8">
        {/* Header */}
        <div className="relative mb-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-white to-slate-50" />
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-200/50">
                <AppstoreOutlined className="text-[28px]" />
              </div>

              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.20em] text-slate-500">
                  <ThunderboltOutlined />
                  Category Control Center
                </div>

                <h1 className="m-0 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                  Category Management
                </h1>

                <p className="mt-2 text-sm text-slate-500 md:text-base">
                  Organize menu categories and manage category cards from one
                  clean admin workspace.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                icon={<ReloadOutlined />}
                onClick={() => window.location.reload()}
                className="!h-11 !rounded-xl !border-slate-200 !text-slate-600 !font-semibold"
              >
                Refresh
              </Button>

              <div className="[&>button]:!h-11 [&>button]:!rounded-xl [&>button]:!px-6 [&>button]:!font-bold">
                <AddCategoryModal setCategories={setCategories} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            icon={<TagsOutlined />}
            label="Total Categories"
            value={totalCategories}
            helper="All loaded category cards"
            color="blue"
          />
          <StatCard
            icon={<FolderOpenOutlined />}
            label="Current State"
            value={loading ? "..." : totalCategories}
            helper={pageStateLabel}
            color="emerald"
          />
          <StatCard
            icon={<AppstoreOutlined />}
            label="Display Mode"
            value="Grid"
            helper="Card based category layout"
            color="amber"
          />
        </div>

        {/* Content */}
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-5 py-4 md:px-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="m-0 text-xl font-extrabold text-slate-900">
                  Category Directory
                </h3>
                <p className="m-0 mt-1 text-sm text-slate-500">
                  Browse all categories and manage them in a clean grid view.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                  Categories: {totalCategories}
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                  {pageStateLabel}
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 md:p-6">
            {loading ? (
              <div className="flex min-h-[240px] items-center justify-center">
                <CustomSkeleton />
              </div>
            ) : !categories || categories.length === 0 ? (
              <div className="py-16">
                <Empty description="No category found" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="rounded-[24px] border border-slate-200 bg-white p-2 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    <CategoryCard
                      category={category}
                      setCategories={setCategories}
                    />
                  </div>
                ))}
              </div>
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
            {value}
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