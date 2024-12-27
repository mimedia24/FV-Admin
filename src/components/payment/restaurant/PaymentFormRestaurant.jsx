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

  function randomCode() {
    const num1 = Math.random() * 10;
    const numb2 = Math.random() * 10;
    // console.log(num1.toFixed(), numb2.toFixed());
    setPaymentDetail((prev) => ({
      ...prev,
      firstCode: num1.toFixed(),
      secondCode: numb2.toFixed(),
    }));
  }

  useEffect(() => {
    randomCode();
  }, []);

  function handleOnChange(e) {
    const { name, value } = e.target;
    setPaymentDetail((prev) => ({ ...prev, [name]: value }));
    console.log(paymentDetail);
  }

  //   handle submit
  async function handleSubmitPayment() {
    try {
      const result =
        Number(paymentDetail.firstCode) + Number(paymentDetail.secondCode);

      console.log(paymentDetail);
      console.log(result);

      if (paymentDetail.paymentAmount == 0) {
        toast.error(`payment amount required.`);
        return;
      }

      if (result != paymentDetail.result) {
        toast.error(`incorrect result.`);
        randomCode();
        return;
      }

      const { data } = await axios.put(
        `${apiPath}/restaurant/wallet/payment?id=${restaurantId}`,
        {
          amount: paymentDetail.paymentAmount,
        },
        {
          headers: {
            "x-auth-token": apiAuthToken,
          },
        }
      );

      console.log(data);

      if (data.success) {
        getRestaurantWallet();
        toast.success(`payment successful.`);
        setPaymentDetail({
          paymentAmount: 0,
          firstCode: 0,
          secondCode: 0,
          result: 0,
        });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.log(error.response.data);
      toast.error(error.response.data.message);
      throw new Error(error.message);
    }
  }

  return (
    <div>
      <div>
        <label htmlFor="riderId" className="inline-block">
          Restaurant ID
        </label>
        <input
          type="text"
          className="block px-2 py-2 rounded-lg border disabled:bg-gray-100 w-full "
          name="restaurantId"
          id="restaurantId"
          placeholder="restaurant id"
          disabled
          value={paymentDetail.restaurantId}
        />
      </div>
      <div>
        <label htmlFor="riderId">Payment amount</label>
        <input
          type="text"
          className="block px-2 py-2 rounded-lg border w-full "
          name="paymentAmount"
          id="paymentAmount"
          placeholder="payment amount"
          onChange={handleOnChange}
        />
      </div>

      <div>
        <label htmlFor="firstCode">First number</label>
        <input
          type="number"
          className="block px-2  disabled:bg-gray-100 py-2 rounded-lg border w-full "
          name="firstCode"
          disabled
          id="firstCode"
          placeholder="first number"
          value={paymentDetail.firstCode}
        />
      </div>
      <div>
        <label htmlFor="secondCode">Second number</label>
        <input
          type="number"
          className="block px-2  disabled:bg-gray-100 py-2 rounded-lg border w-full "
          disabled
          name="secondCode"
          id="secondCode"
          placeholder="second number"
          value={paymentDetail.secondCode}
        />
      </div>
      <div>
        <label htmlFor="secondCode">Result</label>
        <input
          type="number"
          className="block px-2 py-2 rounded-lg border w-full "
          name="result"
          id="result"
          placeholder="result"
          value={paymentDetail.result}
          onChange={handleOnChange}
        />
      </div>
      <div className="flex items-center justify-center gap-4">
        <button
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md mt-3 "
          onClick={handleSubmitPayment}
        >
          submit
        </button>
        <button
          className="w-full bg-orange-500 text-white px-4 py-2 rounded-md mt-3 "
          onClick={() => setIsModalOpen(false)}
        >
          cancel
        </button>
      </div>
    </div>
  );
}
