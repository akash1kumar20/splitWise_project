import { FaCircle } from "react-icons/fa";

const GeneratedBillDetails = () => {
  return (
    <>
      <p className="flex justify-center gap-4 text-sm mt-3 items-center">
        <span className="min-h-6 min-w-6 rounded-full  flex items-center">
          <FaCircle className="text-green-900" />{" "}
          <span className=" ms-1">Amount To Recieve</span>
        </span>
        <span className="min-h-6 min-w-6 rounded-full  flex items-center">
          <FaCircle className="text-red-900" />{" "}
          <span className=" ms-1">Amount To Give</span>
        </span>
      </p>
      <p className="flex justify-center gap-4 text-sm mt-1 items-center">
        <span className="min-h-6 min-w-6 rounded-full  flex items-center">
          P/M -<span className=" ms-1">Pay Method</span>
        </span>
        <span className="min-h-6 min-w-6 rounded-full  flex items-center">
          R/L -<span className=" ms-1">Related To</span>
        </span>
      </p>
    </>
  );
};

export default GeneratedBillDetails;
