import Layout from "./layout";
import TotalUserCard from "../components/totalUserCard";
import TotalRiderCard from "../components/totalRiderCard";
import TotalRestaurantCard from "../components/totalRestaurantCard";
import TotalOrderCard from "../components/totalOrderCard";

export default function Dashboard() {
  return (
    <Layout>
      <div className="w-full py-4">
        <h1 className="text-3xl text-center font-extrabold text-gray-400 my-8">Dashboard</h1>

        <div className="flex items-center justify-center gap-12 flex-wrap">
          <TotalUserCard />
          <TotalRiderCard />
          <TotalRestaurantCard />
          <TotalOrderCard />
        </div>
      </div>
    </Layout>
  );
}
