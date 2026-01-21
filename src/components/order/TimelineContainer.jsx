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
    <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-lg relative">
      {/* Close Button */}
      <button 
        onClick={handleClose}
        className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
        aria-label="Close"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <h2 className="text-gray-800 font-bold mb-6 border-b pb-2 text-lg">
        Order Timeline
      </h2>

      <div className="flex flex-col">
        {steps.map((step, index) => {
          const isCompleted = step.time > 0;
          const isLast = index === steps.length - 1;

          return (
            <div key={index} className="flex min-h-[64px]">
              <div className="flex flex-col items-center mr-4">
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 z-10 ${
                    isCompleted
                      ? "bg-green-500 border-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                      : "bg-white border-gray-300"
                  }`}
                />
                {!isLast && (
                  <div
                    className={`w-0.5 flex-grow ${
                      isCompleted ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>

              <div className="-mt-1 pb-6">
                <p className={`text-sm font-bold ${isCompleted ? "text-gray-800" : "text-gray-400"}`}>
                  {step.label}
                </p>
                {isCompleted ? (
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {formatUnixTime(step.time)}
                  </p>
                ) : (
                  <p className="text-xs text-gray-300 italic mt-0.5">Pending</p>
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