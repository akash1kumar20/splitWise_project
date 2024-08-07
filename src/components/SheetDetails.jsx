import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loading from "../ExtraComponents/Loading";
import useGreetingsHook from "../customHooks/useGreetingsHook";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import SheetDetailsCard from "../Card/SheetDetailsCard";

const SheetDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const param = useParams();
  const inviteCode = useSelector((state) => state.expenseSheet.inviteCode);
  const [sheets, setSheets] = useState([]);
  const [greetings, time] = useGreetingsHook();
  const userMail = useSelector((state) => state.expenseSheet.userMail);
  const [displaySheetDetails, setDisplaySheetDetails] = useState(false);
  let width = screen.width;

  useEffect(() => {
    if (width > 767) {
      setDisplaySheetDetails(true);
    } else if (width < 767) {
      setDisplaySheetDetails(false);
    }
  }, [width]);
  useEffect(() => {
    setIsLoading(true);
  }, []);

  useEffect(() => {
    let sheetName = param.sheetName;
    let toCallSheet;
    if (inviteCode !== null) {
      toCallSheet = inviteCode.includes(sheetName);
    }
    if (toCallSheet) {
      const fetchData = async () => {
        try {
          let res = await axios.get(
            `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${inviteCode}/sheetDetails.json`
          );
          let sheetArr = [];
          if (res.status === 200) {
            for (let key in res.data) {
              sheetArr.push({ ...res.data[key], id: key });
            }
          }
          setSheets(sheetArr);
          setIsLoading(false);
        } catch (err) {
          console.log(err);
        }
      };
      fetchData();
    }
  }, []);
  return (
    <SheetDetailsCard>
      {isLoading && <Loading />}
      {!isLoading && (
        <div className="flex lg:flex-row flex-col gap-y-2 justify-between ">
          {sheets.map((sheet) => (
            <div key={sheet.id}>
              <div className="flex justify-end items-center w-[50%] pe-5 text-3xl">
                {!displaySheetDetails && (
                  <IoIosArrowDropdown
                    onClick={() => setDisplaySheetDetails(true)}
                  />
                )}
                {displaySheetDetails && width < 767 && (
                  <IoIosArrowDropup
                    onClick={() => setDisplaySheetDetails(false)}
                  />
                )}
              </div>
              {displaySheetDetails && (
                <div>
                  <p className="text-sm md:text-lg">
                    Sheet Name: {sheet.sheetName}
                  </p>
                  {userMail !== sheet.userMail ? (
                    <p className="text-[14px] md:text-lg">
                      Admin: <span>{sheet.userMail}</span>
                    </p>
                  ) : (
                    <p className="text-[14px] md:text-lg">
                      You: <span>{sheet.userMail}</span>
                    </p>
                  )}
                  {userMail !== sheet.userMail && <p>You: {userMail}</p>}
                  <p className="text-sm md:text-lg">
                    Invitation Code:
                    <span className="text-md font-semibold underline ps-2">
                      {sheet.inviationCode}
                    </span>
                  </p>
                </div>
              )}
            </div>
          ))}
          <div className="flex lg:flex-col flex-row md:gap-x-3 gap-x-[6px] text-end">
            <p className="text-sm md:text-lg">{time.toDateString()}</p>
            <p className="text-sm md:text-lg">{time.toLocaleTimeString()}</p>
            <p className="text-sm md:text-lg leading-snug">{greetings}</p>
          </div>
        </div>
      )}
    </SheetDetailsCard>
  );
};

export default SheetDetails;
