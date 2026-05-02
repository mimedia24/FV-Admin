import React from "react";

function TimelineContainer({ timeline, handleClose }) {
  const steps = [
    { label: "Order Accepted", time: timeline.restaurantAcceptTime },
    { label: "Rider Assigned", time: timeline.riderAssignTime },
    { label: "Picked Up", time: timeline.pickupTime },
    { label: "Delivered", time: timeline.deliveredTime },
  ];

  const formatUnixTime = (timestamp) => {
    if (!timestamp || timestamp === 0) return null;

    return new Date(timestamp).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Dhaka",
    });
  };

  return (
    <div className="relative mx-auto w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
      <button
        onClick={handleClose}
        className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        aria-label="Close"
      >
        ✕
      </button>

      <h2 className="mb-6 border-b border-slate-100 pb-3 text-lg font-black text-slate-900">
        Order Timeline
      </h2>

      <div className="space-y-1">
        {steps.map((step, index) => {
          const isCompleted = step.time > 0;
          const isLast = index === steps.length - 1;

          return (
            <div key={index} className="flex min-h-[72px] gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`z-10 h-4 w-4 rounded-full border-2 ${
                    isCompleted
                      ? "border-green-500 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.35)]"
                      : "border-slate-300 bg-white"
                  }`}
                />
                {!isLast && (
                  <div className={`w-0.5 flex-1 ${isCompleted ? "bg-green-500" : "bg-slate-200"}`} />
                )}
              </div>

              <div className="pb-5">
                <p className={`text-sm font-bold ${isCompleted ? "text-slate-800" : "text-slate-400"}`}>
                  {step.label}
                </p>

                {isCompleted ? (
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {formatUnixTime(step.time)}
                  </p>
                ) : (
                  <p className="mt-1 text-xs italic text-slate-300">Pending</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TimelineContainer;