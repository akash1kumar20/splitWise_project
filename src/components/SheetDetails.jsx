import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loading from "../ExtraComponents/Loading";
import useGreetingsHook from "../customHooks/useGreetingsHook";

const SheetDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const param = useParams();
  const inviteCode = useSelector((state) => state.expenseSheet.inviteCode);
  const [sheets, setSheets] = useState([]);
  const [greetings, time] = useGreetingsHook();
  const userMail = useSelector((state) => state.expenseSheet.userMail);

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
            `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${inviteCode}.json`
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
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <div className="flex lg:flex-row flex-col gap-y-2 justify-between ">
          {sheets.map((sheet) => (
            <div key={sheet.id}>
              <p className="text-sm md:text-lg">
                Sheet Name: {sheet.sheetName}
              </p>
              {userMail !== sheet.userMail ? (
                <p className="text-sm md:text-lg">
                  Admin: <span>{sheet.userMail}</span>
                </p>
              ) : (
                <p className="text-[14px] md:text-lg">
                  You: <span>{sheet.userMail}</span>
                </p>
              )}
              {userMail !== sheet.userMail && <p>You: {userMail}</p>}
              <p className="text-sm md:text-lg">
                Inivitaion Code:
                <span className="text-md font-semibold underline ps-2">
                  {sheet.inviationCode}
                </span>
              </p>
            </div>
          ))}
          <div className="flex lg:flex-col flex-row gap-x-3 text-end">
            <p className="text-sm md:text-lg">{time.toDateString()}</p>
            <p className="text-sm md:text-lg">{time.toLocaleTimeString()}</p>
            <p className="text-sm md:text-lg leading-snug">{greetings}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default SheetDetails;
