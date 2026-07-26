import { useMemo, useState } from "react";
import ChangeUserStatus from "./changeUserStatus";
import { resolveImageUrl, useImageFallback } from "../../helpers/imageUrl";

function safeValue(value) {
  if (value === undefined || value === null || value === "") return null;
  return value;
}

function shortId(value) {
  if (!value) return "N/A";
  return String(value).slice(-8);
}

function getMapLink(latitude, longitude) {
  if (
    latitude === undefined ||
    latitude === null ||
    latitude === "" ||
    longitude === undefined ||
    longitude === null ||
    longitude === ""
  ) {
    return null;
  }

  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}

function getAddressPhone(data) {
  return (
    data?.phoneNumber ||
    data?.phone ||
    data?.contactNumber ||
    data?.mobile ||
    null
  );
}

function AddressBlock({ title, data }) {
  const address = safeValue(data?.address);
  const longitude = safeValue(data?.longitude);
  const latitude = safeValue(data?.latitude);
  const phone = safeValue(getAddressPhone(data));
  const mapLink = getMapLink(latitude, longitude);

  if (!address) return null;

  return (
    <div className="min-w-[190px] text-left">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          {title}
        </p>

        <p className="mt-1 break-words text-[12px] font-semibold leading-5 text-slate-700">
          {address}
        </p>

        {phone ? (
          <p className="mt-2 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-600">Phone:</span> {phone}
          </p>
        ) : null}

        {(longitude || latitude) ? (
          <div className="mt-2 space-y-1 text-[11px] text-slate-500">
            {longitude ? (
              <p className="truncate">
                <span className="font-semibold text-slate-600">Long:</span>{" "}
                {longitude}
              </p>
            ) : null}
            {latitude ? (
              <p className="truncate">
                <span className="font-semibold text-slate-600">Lat:</span>{" "}
                {latitude}
              </p>
            ) : null}
          </div>
        ) : null}

        {mapLink ? (
          <div className="mt-3">
            <a
              href={mapLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-600 transition hover:bg-blue-100"
            >
              View Map
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function UserCard({ detail, slNO }) {
  const [address] = useState(detail.address);
  const [status, setStatus] = useState(detail?.status);

  const statusClass = useMemo(() => {
    return status === "active"
      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
      : "bg-amber-50 text-amber-600 border-amber-200";
  }, [status]);

  return (
    <tr className="text-[12px] transition-colors hover:bg-slate-50/70">
      <td className="border-b border-slate-200 px-3 py-4 text-center font-semibold text-slate-700 align-top">
        {slNO + 1}
      </td>

      <td className="border-b border-slate-200 px-3 py-4 text-center align-top">
        <div className="mx-auto w-fit rounded-full bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-600 border border-slate-200 whitespace-nowrap">
          {shortId(detail?._id)}
        </div>
        <div className="mt-2 text-[10px] text-slate-400 whitespace-nowrap">
          Full ID hidden
        </div>
      </td>

      <td className="border-b border-slate-200 px-3 py-4 text-center align-top">
        <img
          src={resolveImageUrl(detail.profileImage)}
          alt="profile-image"
          className="mx-auto h-14 w-14 rounded-full border-2 border-slate-200 object-cover shadow-sm"
          onError={useImageFallback}
        />
      </td>

      <td className="border-b border-slate-200 px-3 py-4 text-center align-top">
        <span
          className={`inline-block min-w-[84px] rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide ${statusClass}`}
        >
          {status || "N/A"}
        </span>
      </td>

      <td className="border-b border-slate-200 px-3 py-4 text-center align-top">
        <div className="min-w-[120px] font-semibold text-slate-800 break-words">
          {detail.fullName || "N/A"}
        </div>
      </td>

      <td className="border-b border-slate-200 px-3 py-4 text-center align-top">
        <div className="min-w-[140px] break-words text-slate-600">
          {detail.email || "N/A"}
        </div>
      </td>

      <td className="border-b border-slate-200 px-3 py-4 text-center align-top">
        <div className="min-w-[110px] font-medium text-slate-700">
          {detail.phoneNumber || "N/A"}
        </div>
      </td>

      <td className="border-b border-slate-200 px-3 py-4 text-center align-top">
        <AddressBlock title="Home" data={address?.home} />
      </td>

      <td className="border-b border-slate-200 px-3 py-4 text-center align-top">
        <AddressBlock title="Office" data={address?.office} />
      </td>

      <td className="border-b border-slate-200 px-3 py-4 text-center align-top">
        <AddressBlock title="Others" data={address?.others} />
      </td>

      <td className="border-b border-slate-200 px-3 py-4 text-center align-top">
        <div className="flex items-start justify-center">
          <ChangeUserStatus
            detail={detail}
            status={status}
            setStatus={setStatus}
          />
        </div>
      </td>
    </tr>
  );
}
