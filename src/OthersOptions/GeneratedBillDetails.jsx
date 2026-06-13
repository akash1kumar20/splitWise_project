import {
  FaArrowCircleLeft,
  FaArrowCircleRight,
  FaCircle,
} from "react-icons/fa";

const GeneratedBillDetails = () => {
  return (
    <>
      <p className="flex justify-center gap-4 text-lg mt-3 items-center">
        <span className="min-h-6 min-w-6 rounded-full  flex items-center">
          <FaCircle className="text-green-900" />{" "}
          <span className=" ms-1 flex justify-center items-center gap-1 ">
            <FaArrowCircleLeft /> Recieve
          </span>
        </span>
        <span className="min-h-6 min-w-6 rounded-full  flex items-center">
          <FaCircle className="text-red-900" />
          <span className=" ms-1 flex justify-center items-center gap-1">
            <FaArrowCircleRight />
            Pay
          </span>
        </span>
      </p>
      <p className="flex justify-center gap-4 text-sm mt-1 items-center">
        <span className="min-h-6 min-w-6 rounded-full  flex items-center">
          P/M -<span className=" ms-1">Pay Method</span>
        </span>
        <span className="min-h-6 min-w-6 rounded-full  flex items-center">
          F&L -<span className=" ms-1">Favours & Lending</span>
        </span>
      </p>
    </>
  );
};

export default GeneratedBillDetails;
