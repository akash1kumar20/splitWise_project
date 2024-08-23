import { useSelector } from "react-redux";
import useFetchDataHook from "../customHooks/useFetchDataHook";
import { useNavigate } from "react-router-dom";
import Loading from "../ExtraComponents/Loading";
import SinglePreviousBill from "./SinglePreviousBill";

const PreviousBill = () => {
  const code = useSelector((state) => state.expenseSheet.inviteCode);
  const [comingData, isLoading] = useFetchDataHook(
    `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${code}/previousBills.json`
  );
  const navigate = useNavigate();
  return (
    <div className="pt-2">
      <p
        className="text-center text-3xl bg-black p-2 text-white w-fit mx-auto rounded-xl mb-2 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        X
      </p>
      {comingData.length > 0 && (
        <h1 className="text-center text-2xl font-semibold mb-4">
          Previous Bills
        </h1>
      )}
      {!isLoading &&
        comingData.map((data, i) => (
          <div
            className="bg-slate-300 md:text-lg px-2 font-serif grid md:grid-cols-2 py-2 md:px-10 text-center"
            key={data.id}
          >
            <p>
              {i + 1}. Total Amount - ₹{data.totalAmount + data.relatedMoneyTtl}
              <br />
              R/L Amount - ₹{data.relatedMoneyTtl}
              <br />
              Without R/L Amount - ₹{data.totalAmount}
              <br />
              Total users - {data.totalUsers} <br />
              Per Head Contribution Without R/L Amount - ₹{" "}
              {(data.totalAmount / data.totalUsers).toFixed(2)}
              <br />
              Bill is generated by the <u>{data.generatedBy}</u>
            </p>
            <SinglePreviousBill data={data.data} />
          </div>
        ))}
      {!isLoading && comingData.length > 0 && (
        <p className="text-[7px] md:text-[14px] text-center">
          <b>Note</b> - Ask the user who generated the bill for PDF, for all
          details of the bill.
        </p>
      )}
      {!isLoading && comingData.length === 0 && (
        <p className="text-[7px] md:text-[21px] text-center font-semibold">
          No Previous Bill Available
        </p>
      )}
      {isLoading && <Loading />}
    </div>
  );
};

export default PreviousBill;
