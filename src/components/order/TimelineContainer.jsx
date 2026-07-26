const normalizeStatus = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, " ");

const STATUS_RANK = new Map([
  ["pending", 0],
  ["accepted by restaurant", 1],
  ["accept by restaurant", 1],
  ["escalated to rider", 1],
  ["assigned to rider", 2],
  ["accepted by rider", 2],
  ["accept by rider", 2],
  ["ready for pickup", 3],
  ["picked up", 4],
  ["out for delivery", 4],
  ["on delivery", 4],
  ["delivery", 4],
  ["delivered", 5],
  ["complete", 5],
  ["completed", 5],
]);

const isCancelledStatus = (status) =>
  ["cancelled", "canceled", "cancelled by restaurant", "canceled by restaurant"]
    .includes(status) || status.includes("cencel");

const getTimestamp = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const formatTime = (timestamp) => {
  if (!timestamp || timestamp === 0) return null;
  const numeric = Number(timestamp);
  const value =
    Number.isFinite(numeric) && numeric > 0 && numeric < 100000000000
      ? numeric * 1000
      : timestamp;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Dhaka",
  });
};

function TimelineContainer({ order, handleClose }) {
  const status = normalizeStatus(order?.status || order?.orderStatus);
  const rank = STATUS_RANK.get(status) ?? 0;
  const cancelled = isCancelledStatus(status);

  const stages = [
    {
      key: "accepted",
      label: "Order Accepted",
      rank: 1,
      timestamp: getTimestamp(
        order?.restaurantAcceptedAt,
        order?.restaurantAcceptTime,
      ),
    },
    {
      key: "assigned",
      label: "Rider Assigned",
      rank: 2,
      timestamp: getTimestamp(
        order?.riderAcceptedAt,
        order?.riderAssignTime,
        order?.assignedAt,
      ),
    },
    {
      key: "ready",
      label: "Ready for Pickup",
      rank: 3,
      timestamp: order?.readyForPickupAt,
    },
    {
      key: "picked",
      label: "Picked Up",
      rank: 4,
      timestamp: getTimestamp(order?.pickedUpAt, order?.pickupTime),
    },
    {
      key: "delivered",
      label: "Delivered",
      rank: 5,
      timestamp: getTimestamp(order?.deliveredAt, order?.deliveredTime),
    },
  ].map((stage) => ({
    ...stage,
    completed: rank >= stage.rank,
    skipped: cancelled && rank < stage.rank,
  }));

  if (cancelled) {
    stages.push({
      key: "cancelled",
      label: "Cancelled",
      completed: true,
      skipped: false,
      timestamp: getTimestamp(order?.cancelledAt, order?.updatedAt),
      reason: order?.cancelReason || order?.cancellationReason,
    });
  }

  return (
    <div className="relative mx-auto w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
      <button
        onClick={handleClose}
        className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        aria-label="Close"
      >
        ✕
      </button>

      <h2 className="border-b border-slate-100 pb-3 text-lg font-black text-slate-900">
        Order Timeline
      </h2>
      <p className="mb-5 mt-2 text-xs font-semibold capitalize text-slate-500">
        Current status: {order?.status || order?.orderStatus || "pending"}
      </p>

      <div className="space-y-1">
        {stages.map((stage, index) => {
          const formattedTime = formatTime(stage.timestamp);
          const isLast = index === stages.length - 1;
          const tone = stage.skipped
            ? "border-slate-300 bg-slate-200"
            : stage.completed
              ? stage.key === "cancelled"
                ? "border-rose-500 bg-rose-500"
                : "border-emerald-500 bg-emerald-500"
              : "border-slate-300 bg-white";

          return (
            <div key={stage.key} className="flex min-h-[72px] gap-4">
              <div className="flex flex-col items-center">
                <div className={`z-10 h-4 w-4 rounded-full border-2 ${tone}`} />
                {!isLast ? (
                  <div
                    className={`w-0.5 flex-1 ${
                      stage.completed ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                ) : null}
              </div>

              <div className="pb-5">
                <p
                  className={`text-sm font-bold ${
                    stage.skipped || !stage.completed
                      ? "text-slate-400"
                      : stage.key === "cancelled"
                        ? "text-rose-600"
                        : "text-slate-800"
                  }`}
                >
                  {stage.label}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {stage.skipped
                    ? "Skipped"
                    : stage.completed
                      ? formattedTime || "Completed — time was not recorded"
                      : "Pending"}
                </p>
                {stage.reason ? (
                  <p className="mt-1 text-xs text-rose-500">{stage.reason}</p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TimelineContainer;
