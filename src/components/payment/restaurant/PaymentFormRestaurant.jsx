import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiAuthToken, apiPath } from "../../../../secrets";

export default function PaymentFormRestaurant({
  restaurantId,
  isModalOpen,
  setIsModalOpen,
  getRestaurantWallet,
}) {
  const [paymentDetail, setPaymentDetail] = useState({
    restaurantId: restaurantId,
    paymentAmount: "",
    firstCode: 0,
    secondCode: 0,
    result: 0,
  });

  const [loading, setLoading] = useState(false); 

  function randomCode() {
    const num1 = Math.random() * 10;
    const num2 = Math.random() * 10;
    setPaymentDetail((prev) => ({
      ...prev,
      firstCode: num1.toFixed(),
      secondCode: num2.toFixed(),
    }));
  }

  useEffect(() => {
    randomCode();
  }, []);

  function handleOnChange(e) {
    const { name, value } = e.target;
    setPaymentDetail((prev) => ({ ...prev, [name]: value }));
  }

  // handle submit
  async function handleSubmitPayment() {
    if (loading) return; // prevent multiple clicks
    try {
      setLoading(true);

      const result =
        Number(paymentDetail.firstCode) + Number(paymentDetail.secondCode);

      if (!paymentDetail.paymentAmount || paymentDetail.paymentAmount == 0) {
        toast.error(`Payment amount required.`);
        setLoading(false);
        return;
      }

      if (result != paymentDetail.result) {
        toast.error(`Incorrect result.`);
        randomCode();
        setLoading(false);
        return;
      }

      const { data } = await axios.put(
        `${apiPath}/admin/payment/restaurant/update-balance?id=${restaurantId}&amount=${paymentDetail.paymentAmount}`,
        {
          amount: paymentDetail.paymentAmount,
        },
        {
          headers: {
            "x-auth-token": apiAuthToken,
          },
        }
      );

      if (data.success) {
        getRestaurantWallet();
        toast.success(`Payment successful.`);
        setPaymentDetail({
          restaurantId: restaurantId,
          paymentAmount: "",
          firstCode: 0,
          secondCode: 0,
          result: 0,
        });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false); // stop loading
    }
  }

  return (
    <div>
      <div>
        <label htmlFor="restaurantId" className="inline-block">
          Restaurant ID
        </label>
        <input
          type="text"
          className="block px-2 py-2 rounded-lg border disabled:bg-gray-100 w-full"
          name="restaurantId"
          id="restaurantId"
          placeholder="restaurant id"
          disabled
          value={paymentDetail.restaurantId}
        />
      </div>
      <div>
        <label htmlFor="paymentAmount">Payment amount</label>
        <input
          type="text"
          className="block px-2 py-2 rounded-lg border w-full"
          name="paymentAmount"
          id="paymentAmount"
          placeholder="payment amount"
          onChange={handleOnChange}
          value={paymentDetail.paymentAmount}
        />
      </div>
      <div>
        <label htmlFor="firstCode">First number</label>
        <input
          type="number"
          className="block px-2 py-2 rounded-lg border w-full disabled:bg-gray-100"
          name="firstCode"
          id="firstCode"
          disabled
          value={paymentDetail.firstCode}
        />
      </div>
      <div>
        <label htmlFor="secondCode">Second number</label>
        <input
          type="number"
          className="block px-2 py-2 rounded-lg border w-full disabled:bg-gray-100"
          name="secondCode"
          id="secondCode"
          disabled
          value={paymentDetail.secondCode}
        />
      </div>
      <div>
        <label htmlFor="result">Result</label>
        <input
          type="number"
          className="block px-2 py-2 rounded-lg border w-full"
          name="result"
          id="result"
          placeholder="result"
          value={paymentDetail.result}
          onChange={handleOnChange}
        />
      </div>
      <div className="flex items-center justify-center gap-4">
        <button
          className={`w-full px-4 py-2 rounded-md mt-3 text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
          }`}
          onClick={handleSubmitPayment}
          disabled={loading}
        >
          {loading ? "Processing..." : "Submit"}
        </button>
        <button
          className="w-full bg-orange-500 text-white px-4 py-2 rounded-md mt-3"
          onClick={() => setIsModalOpen(false)}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
