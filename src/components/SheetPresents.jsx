import axios from "axios";
import { FaSearch, FaTrash } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Footer from "../ExtraComponents/Footer";
import { useDispatch, useSelector } from "react-redux";
import { expenseSheetActions } from "../../store/expenseSheetSlice";
import useFetchDataHook from "../customHooks/useFetchDataHook";
import Loading from "../ExtraComponents/Loading";

const AddSheet = () => {
  const changeEmail = useSelector((state) => state.expenseSheet.convertedMail);
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();
  const userMail = useSelector((state) => state.expenseSheet.userMail);
  const [comingData, isLoading] = useFetchDataHook(
    `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${changeEmail}/sheets.json`
  );

  const navigate = useNavigate();
  const openSpecificSheetHandler = (sheet) => {
    dispatch(
      expenseSheetActions.setCodes({
        sheetCode: sheet.code,
        inviteCode: sheet.inviationCode,
      })
    );
    navigate(`/home/sheets/${sheet.code}`);
  };

  const deleteSheetHandler = async (sheet) => {
    try {
      let delQuery1 = await axios.delete(
        `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${changeEmail}/sheets/${sheet.id}.json`
      );
      let delQuery2;
      if (sheet.userMail === userMail) {
        delQuery2 = await axios.delete(
          `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${sheet.inviationCode}.json`
        );
      }
    } catch (error) {}
  };
  return (
    <>
      <div
        className={
          theme
            ? "text-gray-900 bg-white h-[100vh] w-[100vw]"
            : "bg-gray-900 text-white h-[100vh] w-[100vw]"
        }
      >
        <h1 className="md:text-3xl text-xl pt-10 text-center font-serif underline">
          It sounds extraordinary but it's a fact that balance sheets can make
          fascinating reading.
        </h1>
        {isLoading && <Loading />}
        {!isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 py-8 md:mx-32 gap-y-6 ">
            {comingData.map((sheet) => (
              <div
                className="flex flex-col items-center gap-3 static"
                key={sheet.id}
              >
                <FaTrash
                  className="relative top-[20px] left-6 text-red-500 hover:text-red-700 cursor-pointer hover:scale-150"
                  onClick={() => deleteSheetHandler(sheet)}
                />
                <p
                  className="text-xl p-6 rounded-full bg-gray-600 border-2 border-gray-500 shadow-xl cursor-pointer"
                  onClick={() => openSpecificSheetHandler(sheet)}
                >
                  {sheet.sheetName.substring(0, 2)}...
                </p>
                <span className="text-sm ">{sheet.sheetName}</span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-3 mt-9">
              <p
                className="text-2xl p-6 rounded-full bg-gray-600 border-2 border-gray-500 shadow-xl cursor-pointer"
                onClick={() => navigate("/home/sheets/addSheet")}
              >
                <IoMdAdd />
              </p>
              <span className="text-sm ">Add Sheet</span>
            </div>
            <div className="flex flex-col items-center gap-3 mt-9">
              <p
                className="text-xl p-6 rounded-full bg-gray-600 border-2 border-gray-500 shadow-xl cursor-pointer"
                onClick={() => navigate("/home/sheets/findSheet")}
              >
                <FaSearch />
              </p>
              <span className="text-sm ">Find Sheet</span>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AddSheet;
