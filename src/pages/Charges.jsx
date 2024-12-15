import { useEffect, useState } from "react";
import Layout from "./layout";
import axios from "axios";
import { apiAuthToken, apiPath } from "../../secrets";

export default function Charges() {
  const [charges, setCharges] = useState(null);
  useEffect(() => {
    // get chargeList
    async function getChargeList() {
      try {
        const { data } = await axios.get(`${apiPath}/charges/schedule`, {
          headers: {
            "x-auth-token": apiAuthToken,
          },
        });

        console.log(data);
        setCharges(data.charges);
      } catch (error) {
        throw new Error(error);
      }

      // if (data.success) {
      //   console.log(`charges is : ${data.charges[0]}`);
      //   setChargeList(data.charges[0]);
      // } else {
      //   toast.error("something went wrong. Please try again.");
      // }
    }

    getChargeList();
  }, []);
  return (
    <Layout>
      <div className="w-full py-4">
        <h1 className="text-3xl text-center font-extrabold text-gray-400 my-8">
          Charges
        </h1>

        <div className="p-4 md:p-8 lg:p-12">
          <div>
            <table className="w-full">
              <tr>
                <td className="border px-3 py-1 text-sm text-center font-semibold">
                  SL no
                </td>
                <td className="border px-3 py-1 text-sm text-center font-semibold">
                  Rider first KM
                </td>
                <td className="border px-3 py-1 text-sm text-center font-semibold">
                  Rider others KM
                </td>
                <td className="border px-3 py-1 text-sm text-center font-semibold">
                  User first KM
                </td>
                <td className="border px-3 py-1 text-sm text-center font-semibold">
                  User others KM
                </td>
                <td className="border px-3 py-1 text-sm text-center font-semibold">
                  status
                </td>
                <td className="border px-3 py-1 text-sm text-center font-semibold">
                  action
                </td>
              </tr>

              <tbody>
                {charges &&
                  charges.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td className="border px-3 py-1 text-sm text-center">
                          {index + 1}
                        </td>
                        <td className="border px-3 py-1 text-sm text-center">
                          {item.riderFirstKMCharge}
                        </td>
                        <td className="border px-3 py-1 text-sm text-center">
                          {item.riderOthersKMCharge}
                        </td>
                        <td className="border px-3 py-1 text-sm text-center">
                          {item.userFirstKMCharge}
                        </td>
                        <td className="border px-3 py-1 text-sm text-center">
                          {item.userOthersKMCharge}
                        </td>
                        <td className="border px-3 py-1 text-sm text-center">
                          {item.isActive ? "active" : "disabled"}
                        </td>
                        <td className="border px-3 py-1 text-sm text-center">
                          edit
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
