import { useEffect, useState } from "react";
import Layout from "./layout";
import axios from "axios";
import { apiAuthToken, apiPath } from "../../secrets";
import { RiSecurePaymentLine } from "react-icons/ri";

export default function PaymentManagement() {
  const [riderList, setRiderList] = useState(null);

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

      console.log(data);
      if (data.success) {
        setRiderList(data.wallet);
      }
    } catch (error) {}
  }

  useEffect(() => {
    getRiderWalletList();
  }, []);

  return (
    <Layout>
      <div>
        <h1 className="text-center mt-8 text-3xl text-gray-500">
          Payment management
        </h1>
      </div>
      <div className="w-full flex items-center justify-center mt-5">
        <div>
          <button className="text-sm px-4 py-2 bg-gray-400 rounded-md mr-4 text-white">
            Rider Payment
          </button>
          <button className="text-sm px-4 py-2 bg-gray-400 rounded-md mr-4 text-white">
            Restaurant Payment
          </button>
        </div>
      </div>{" "}
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
                <td className="text-center px-2 py-1 border">Address</td>
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
                        {item?.riderId?.email}
                      </td>
                      <td className="text-center px-2 py-1 border">
                        {item.walletBalance}
                      </td>
                      <td className="text-center px-2 py-1 border">
                        {item?.riderId?.riderStatus}
                      </td>
                      <td className="text-center px-2 py-1 border">
                        <span className="text-lg cursor-pointer text-blue-500">
                          <RiSecurePaymentLine />
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
