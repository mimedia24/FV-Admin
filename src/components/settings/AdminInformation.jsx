import React, { useMemo, useRef, useState } from "react";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  BadgeCheck,
  UserCircle2,
  Pencil,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";

const DEFAULT_PROFILE = {
  name: "MD Ibrahmi",
  role: "SUPER ADMIN",
  email: "admin@komolnogor.com",
  phone: "+880 1861-113852",
  location: "Lakshmipur, Bangladesh",
  joinedDate: "March 15, 2024",
  zones: ["Lakshmipur", "Noakhali", "Bangladesh"],
  avatar: "",
};

export default function AdminInformation() {
  const fileInputRef = useRef(null);

  const savedProfile = useMemo(() => {
    try {
      const raw = localStorage.getItem("adminProfileSettings");
      return raw ? JSON.parse(raw) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  }, []);

  const [profile, setProfile] = useState(savedProfile);
  const [isEditing, setIsEditing] = useState(false);

  const saveProfile = (nextProfile) => {
    setProfile(nextProfile);
    localStorage.setItem("adminProfileSettings", JSON.stringify(nextProfile));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const nextProfile = {
        ...profile,
        avatar: reader.result,
      };
      saveProfile(nextProfile);
      toast.success("Profile photo updated.");
    };
    reader.readAsDataURL(file);
  };

  const handleFieldChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    saveProfile(profile);
    setIsEditing(false);
    toast.success("Profile information updated.");
  };

  const InfoCard = ({ icon, label, value }) => (
    <div className="rounded-[24px] border border-slate-200 bg-white/70 p-4 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-500">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
            {label}
          </p>
          <p className="mt-1 break-words text-base font-semibold text-slate-800">
            {value}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Top hero profile card */}
      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
        <div className="relative h-36 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.12),_transparent_22%)]" />
        </div>

        <div className="relative px-6 pb-6">
          <div className="-mt-16 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="relative h-28 w-28 shrink-0 rounded-[28px] border-4 border-white bg-white shadow-xl">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Admin"
                    className="h-full w-full rounded-[22px] object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-[22px] bg-slate-50 text-slate-400">
                    <UserCircle2 size={58} />
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleImageClick}
                  className="absolute -bottom-2 -right-2 flex h-11 w-11 items-center justify-center rounded-2xl border-4 border-white bg-white text-slate-700 shadow-lg transition hover:scale-105 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Camera size={18} />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              <div className="min-w-0 pb-1">
                {isEditing ? (
                  <input
                    value={profile.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-2xl font-black tracking-tight text-slate-900 outline-none focus:border-blue-500"
                    placeholder="Enter admin name"
                  />
                ) : (
                  <h2 className="break-words text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                    {profile.name || "Admin Name"}
                  </h2>
                )}

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                    {profile.role}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500">
                    <BadgeCheck size={16} className="text-blue-500" />
                    Verified Account
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {isEditing ? (
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
                >
                  <Save size={16} />
                  Save Profile
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <Pencil size={16} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info blocks */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[30px] border border-slate-200 bg-slate-50/70 p-5">
          <h3 className="mb-4 text-[12px] font-black uppercase tracking-[0.22em] text-slate-400">
            Contact Details
          </h3>

          <div className="space-y-4">
            <InfoCard
              icon={<Mail size={18} />}
              label="Email Address"
              value={
                isEditing ? (
                  <input
                    value={profile.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base font-medium text-slate-800 outline-none focus:border-blue-500"
                  />
                ) : (
                  profile.email
                )
              }
            />

            <InfoCard
              icon={<Phone size={18} />}
              label="Phone Number"
              value={
                isEditing ? (
                  <input
                    value={profile.phone}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base font-medium text-slate-800 outline-none focus:border-blue-500"
                  />
                ) : (
                  profile.phone
                )
              }
            />
          </div>
        </div>

        <div className="rounded-[30px] border border-slate-200 bg-slate-50/70 p-5">
          <h3 className="mb-4 text-[12px] font-black uppercase tracking-[0.22em] text-slate-400">
            Account Status
          </h3>

          <div className="space-y-4">
            <InfoCard
              icon={<CalendarDays size={18} />}
              label="Joined Date"
              value={
                isEditing ? (
                  <input
                    value={profile.joinedDate}
                    onChange={(e) =>
                      handleFieldChange("joinedDate", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base font-medium text-slate-800 outline-none focus:border-blue-500"
                  />
                ) : (
                  profile.joinedDate
                )
              }
            />

            <InfoCard
              icon={<MapPin size={18} />}
              label="Location"
              value={
                isEditing ? (
                  <input
                    value={profile.location}
                    onChange={(e) =>
                      handleFieldChange("location", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base font-medium text-slate-800 outline-none focus:border-blue-500"
                  />
                ) : (
                  profile.location
                )
              }
            />
          </div>
        </div>
      </div>

      {/* Managed zones */}
      <div className="rounded-[30px] border border-slate-200 bg-slate-50/70 p-5">
        <h3 className="mb-4 text-[12px] font-black uppercase tracking-[0.22em] text-slate-400">
          Managed Delivery Zones
        </h3>

        <div className="flex flex-wrap gap-3">
          {profile.zones?.map((zone, index) => (
            <span
              key={index}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
            >
              {zone}
            </span>
          ))}

          {isEditing && (
            <button
              type="button"
              onClick={() => {
                const nextZone = prompt("Enter new zone name");
                if (!nextZone) return;
                setProfile((prev) => ({
                  ...prev,
                  zones: [...(prev.zones || []), nextZone],
                }));
              }}
              className="rounded-2xl border border-dashed border-blue-300 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
            >
              + Assign New Zone
            </button>
          )}
        </div>
      </div>
    </div>
  );
}