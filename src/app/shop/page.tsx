import Navbar from "@/components/Navbar";
import ShopComponent from "@/components/Shop";

export default function Shop() {
  return (
    <>
      <div className="pb-16">
        <div className=" p-8 pb-4 flex justify-center text-2xl font-semibold ">
          Shop
        </div>
        <ShopComponent />
      </div>
      <Navbar />
    </>
  );
}
