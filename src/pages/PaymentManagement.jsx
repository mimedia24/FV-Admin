import { useEffect, useState } from "react";
import Layout from "./layout";
import axios from "axios";
import { RiSecurePaymentLine } from "react-icons/ri";
import PaymentModal from "../components/payment/rider/PaymentModal";
import { apiAuthToken, apiPath } from "../../secrets";
import { Link, useParams } from "react-router-dom";
import PaymentModalRestaurant from "../components/payment/restaurant/PaymentModal";

export default function PaymentManagement() {
  const [riderList, setRiderList] = useState(null);
  const [restaurantList, setRestaurantList] = useState(null);

  // payment from
  const { payment } = useParams();

  //   get rider list with wallet
  async function getRiderWalletList() {
    try {
      const { data } = await axios.get(
        `${apiPath}/wallet/walletList/list-wallet`,
        {
          headers: {
            "x-auth-token": apiAuthToken,
          },
        }
      );

      // console.log(data);
      if (data.success) {
        setRiderList(data.wallet);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // get restauarnt wallet list
  async function getRestaurantWalletList() {
    try {
      const { data } = await axios.get(
        `${apiPath}/admin/payment/restaurant/wallet`,
        {
          headers: {
            "x-auth-token": apiAuthToken,
          },
        }
      );
      if (data.success) {
        setRestaurantList(data.restaurant);
      } else {
        setRestaurantList([]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getRiderWalletList();
  }, []);

  useEffect(() => {
    getRestaurantWalletList();
  }, []);

  return (
    <Layout>
      <div>
        <h1 className="text-center mt-8 text-3xl text-gray-500">
          Payment management
        </h1>
      </div>
      {/* <div className="w-full flex items-center justify-center mt-5">
        <div className="w-full flex items-center justify-center mt-5">
          <div>
            <Link
              to={"/payment/rider"}
              
            >
              Rider Payment
            </Link>
            <Link
              to={"/payment/restaurant"}
              
            >
              Restaurant Payment
            </Link>
          </div>
        </div>
      </div> */}
    <div className="pl-20 " >
      <Link className=" mx-3 text-center px-4 py-2 bg-purple-500 text-white rounded-md" to={"/payment/rider"}>
        Rider payment
    </Link>
      <Link className="mx-3 text-center px-4 py-2 bg-purple-500 text-white rounded-md" to={"/payment/restaurant"}>
        Restaurant payment
    </Link>
    </div>

      {payment === "rider" ? (
        <div className="px-2 md:px-12 py-12">
          <hr />
          <h1 className="text-center py-2">Rider Wallet List</h1>
          <hr />
          <div>
            <table className="w-full text-[12px]">
              <thead>
                <tr>
                  <td className="text-center px-2 py-1 border">SL</td>
                  <td className="text-center px-2 py-1 border">Name</td>
                  <td className="text-center px-2 py-1 border">Email</td>
                  <td className="text-center px-2 py-1 border">ID</td>
                  <td className="text-center px-2 py-1 border">
                    Payment Number
                  </td>
                  <td className="text-center px-2 py-1 border">Balance</td>
                  <td className="text-center px-2 py-1 border">status</td>
                  <td className="text-center px-2 py-1 border">Action</td>
                </tr>
              </thead>

              <tbody>
                {riderList &&
                  riderList.map((item, index) => {
                    return (
                      <tr key={item._id}>
                        <td className="text-center px-2 py-1 border">
                          {index + 1}
                        </td>
                        <td className="text-center px-2 py-1 border">
                          {item?.riderId?.name}
                        </td>
                        <td className="text-center px-2 py-1 border">
                          {item?.riderId?.email}
                        </td>
                        <td className="text-center px-2 py-1 border">
                          {item?.riderId?._id}
                        </td>
                        <td className="text-center px-2 py-1 border">
                          {item?.riderId?.paymentNumber || "N/A"}
                        </td>
                        <td className="text-center font-bold text-lg px-2 py-1 border">
                          {item.walletBalance}
                        </td>
                        <td className="text-center px-2 py-1 border">
                          {item?.riderId?.riderStatus}
                        </td>
                        <td className="text-center px-2 py-1 border">
                          <PaymentModal
                            riderId={item?.riderId._id}
                            getRiderWalletList={getRiderWalletList}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
      {payment === "restaurant" ? (
        <div className="px-2 md:px-12 py-12">
          <hr />
          <h1 className="text-center py-2">Restaurant wallet List</h1>
          <hr />
          <div>
            <table className="w-full text-[12px]">
              <thead>
                <tr>
                  <td className="text-center px-2 py-1 border">Name</td>
                  <td className="text-center px-2 py-1 border">Phone</td>
                  <td className="text-center px-2 py-1 border">Address</td>
                  <td className="text-center px-2 py-1 border">Balance</td>
                  <td className="text-center px-2 py-1 border">Action</td>
                </tr>
              </thead>

              <tbody>
                {restaurantList &&
                  restaurantList.map((item) => {
                    return (
                      <RestaurantCard
                        key={item._id}
                        restaurant={item}
                        getRestaurantWalletList={getRestaurantWalletList}
                      />
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </Layout>
  );
}

function RestaurantCard({ restaurant, getRestaurantWalletList }) {
  return (
    <tr>
      <td className="text-center border-2">{restaurant.name}</td>
      <td className="text-center border-2">{restaurant.phone}</td>
      <td className="text-center border-2">{restaurant.address}</td>
      <td className="text-center border-2">{restaurant.balance}</td>
      <td className="text-center px-2 py-1 border">
        <PaymentModalRestaurant
          restaurantId={restaurant._id}
          getRestaurantWallet={getRestaurantWalletList}
        />
      </td>
    </tr>
  );
}
