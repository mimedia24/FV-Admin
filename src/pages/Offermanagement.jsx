import React, { useEffect, useState } from "react";
import Layout from "./layout";
import axios from "axios";
import { apiAuthToken, apiPath } from "../../secrets";
import OfferCard from "../components/offer/OfferCard";

export default function Offermanagement() {
  const [advertisement, setAdvertisement] = useState(null);
  useEffect(() => {
    async function fetchAdvertisementImage() {
      try {
        const response = await axios.get(`${apiPath}/offer/all-offer`, {
          headers: {
            "x-auth-token": apiAuthToken,
          },
        });
        const data = await response.data;
        if (data.success) {
          setAdvertisement(data.response.offer);
          console.log(data.response.offer);
        }
      } catch (error) {
        throw new Error(error);
      }
    }
    fetchAdvertisementImage();
  }, []);

  return (
    <Layout>
      <div className="w-full py-4">
        <h1 className="text-3xl text-center font-extrabold text-gray-400 my-8">
          Offer Management
        </h1>

        {/* <h1 className="text-xl text-center font-extrabold text-gray-400 my-8">
          List of orders
        </h1> */}

        <div className="w-full text-center text-3xl text-gray-400">
          Advertisement image
        </div>
        <div>
          {advertisement?.map((item) => {
            return <OfferCard item={item} key={item.id} />;
          })}
        </div>
      </div>
    </Layout>
  );
}
