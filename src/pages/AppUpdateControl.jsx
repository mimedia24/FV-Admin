import { Smartphone } from "lucide-react";
import AppUpdateManagement from "../components/settings/AppUpdateManagement";
import Layout from "./layout";

export default function AppUpdateControl() {
  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 p-3 md:p-6">
        <div className="mx-auto max-w-7xl space-y-5">
          <section className="overflow-hidden rounded-[30px] bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 p-6 text-white shadow-xl md:p-8">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                <Smartphone size={27} />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100">
                  Mobile release control
                </p>
                <h1 className="mt-1 text-2xl font-black md:text-4xl">
                  App Update Control
                </h1>
                <p className="mt-2 text-sm text-cyan-50">
                  User App-এর daily reminder ও mandatory update এখান থেকে
                  নিয়ন্ত্রণ করুন।
                </p>
              </div>
            </div>
          </section>

          <AppUpdateManagement />
        </div>
      </div>
    </Layout>
  );
}

