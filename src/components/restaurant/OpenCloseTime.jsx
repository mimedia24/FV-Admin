import { TimePicker, message } from "antd";
import dayjs from "dayjs";
import axiosInstance from "../../services/axios/axiosInstance";

const format = "HH:mm";

function OpenCloseTime({
  restaurantId,
  openingTime,
  closingTime,
  setRestaurant,
}) {
    
async function handleTimeChange(timeString, type) {
  try {
    const payload = {
      restaurantId,
      openingTime: type === "open" ? timeString : openingTime,
      closingTime: type === "close" ? timeString : closingTime,
    };

    const { data } = await axiosInstance.put(`/restaurant/update-time`, payload);

    if (data) {
      message.success(`${type === "open" ? "Opening" : "Closing"} time updated`);

      setRestaurant((prev) =>
        prev.map((item) =>
          item._id === restaurantId 
            ? { ...item, ...payload } 
            : item
        )
      );
    }
  } catch (error) {
    message.error("Update failed");
  }
}

  return (
    <div className="flex gap-4 items-center bg-gray-50 p-3 rounded-lg">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Opening</span>
        <TimePicker
          value={openingTime ? dayjs(openingTime, format) : null}
          format={format}
          allowClear={false}
          onChange={(_, timeString) => handleTimeChange(timeString, "open")}
        />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Closing</span>
        <TimePicker
          value={closingTime ? dayjs(closingTime, format) : null}
          format={format}
          allowClear={false}
          onChange={(_, timeString) => handleTimeChange(timeString, "close")}
        />
      </div>
    </div>
  );
}

export default OpenCloseTime;