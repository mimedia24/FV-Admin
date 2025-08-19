import { Button } from "antd";
import { Link } from "react-router-dom";

function RiderHeader() {
  return (
    <div className="w-[80%] py-4 border-2 px-3 m-4 mx-auto flex gap-3">
      <Link to={"/rider-management/register"}>
        <Button type="primary">Register</Button>
      </Link>

      <Link to={"/rider-management/withdraw-list"}>
        <Button type="primary">withdraw list</Button>
      </Link>

      <Link to={"/rider-management/collection-payment-list"}>
        <Button type="primary">Collection payment</Button>
      </Link>
    </div>
  );
}

export default RiderHeader;
