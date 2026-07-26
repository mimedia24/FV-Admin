import { resolveImageUrl, useImageFallback } from "../helpers/imageUrl";

export default function SearchCard({ rider }) {

    console.log(rider)
  return (
    <div className="w-4/5 my-8 mx-auto shadow-md rounded-md px-12 py-4">
        <div>
            <img
              src={resolveImageUrl(rider?.profileImage)}
              alt="profile image"
              className="w-28 h-28 rounded-full object-cover"
              onError={useImageFallback}
            />
        </div>
      <p>name: {rider?.name}</p>
      <p>id: {rider?._id}</p>
      <p>email: {rider?.email}</p>
      <p>phone: {rider?.phone}</p>
      <p>wallet id: {rider?.wallet}</p>
      <p>address: {rider?.address}</p>
    </div>
  );
}
