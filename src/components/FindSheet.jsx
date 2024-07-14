import { useRef } from "react";
import CardComponent from "../Card/CardComponent";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { expenseSheetActions } from "../../store";

const FindSheet = () => {
  const codeRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  async function findSheetHandler(event) {
    event.preventDefault();
    let invitationCode = codeRef.current.value;
    try {
      let res = await axios.get(
        `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${invitationCode}/sheetDetails.json`
      );
      if (res.data === null) {
        return alert("No Sheet found");
      }
      let dataArr = [];
      for (let key in res.data) {
        dataArr.push({ ...res.data[key], id: key });
        dispatch(expenseSheetActions.setSheetFoundData(dataArr));
      }
      if (res.status === 200) {
        navigate("/home/sheets/foundSheet");
      }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <CardComponent>
      <h2 className="text-xl font-semibold">Find Sheet</h2>
      <form className="mt-4" onSubmit={(event) => findSheetHandler(event)}>
        <input
          name="sheetName"
          type="text"
          required
          ref={codeRef}
          placeholder="Enter invitation code here"
          className="py-2 ps-2 bg-slate-500 text-white focus:outline-none placeholder:text-white  rounded-md border border-slate-700 w-[100%]"
        />
        <button className="px-6 py-3 bg-blue-800 text-white rounded-xl mt-3">
          Find
        </button>
      </form>
    </CardComponent>
  );
};

export default FindSheet;
