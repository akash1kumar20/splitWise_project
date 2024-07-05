import { useEffect, useState } from "react";
import Navbar from "../ExtraComponents/Navbar";
import Footer from "../ExtraComponents/Footer";
import Profile from "../ExtraComponents/Profile";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import SheetDetailsCard from "../Card/SheetDetailsCard";
import axios from "axios";
import CreateExpense from "../Expenses/CreateExpense";
import { useSelector } from "react-redux";
import Users from "../ExtraComponents/Users";
import useFetchDataHook from "../customHooks/useFetchDataHook";
import Loading from "../ExtraComponents/Loading";
import useGreetingsHook from "../customHooks/useGreetingsHook";

const SingleSheet = () => {
  const token = useSelector((state) => state.expenseSheet.token);
  const navigate = useNavigate();
  const sheetCode = useSelector((state) => state.expenseSheet.sheetCode);
  const [sheets, setSheets] = useState([]);
  const [addUser, setAddUser] = useState(false);
  const [greetings, time] = useGreetingsHook();

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      navigate(`/home/sheets/${sheetCode}/displayExpense`);
    }
  }, []);

  const param = useParams();
  const userMail = useSelector((state) => state.expenseSheet.userMail);
  const inviteCode = useSelector((state) => state.expenseSheet.inviteCode);

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
        } catch (err) {
          console.log(err);
        }
      };
      fetchData();
    }
  }, []);

  const [openProfile, setOpenProfile] = useState(false);

  const profileChangeHandler = () => {
    setOpenProfile((openProfile) => !openProfile);
  };
  let urlKey = "usersList" + inviteCode;
  const [comingData, isLoading] = useFetchDataHook(
    `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${urlKey}.json`
  );

  return (
    <div>
      <Navbar openProfile={profileChangeHandler} />
      {openProfile && <Profile />}
      <div className="md:flex  ">
        <SheetDetailsCard>
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
                <p className="text-sm md:text-lg">
                  {time.toLocaleTimeString()}
                </p>
                <p className="text-sm md:text-lg leading-snug">{greetings}</p>
              </div>
            </div>
          )}
        </SheetDetailsCard>
        <SheetDetailsCard>
          {addUser && <Users />}
          {comingData.length > 0 && addUser && (
            <p
              className="text-blue-400 font-bold cursor-pointer mt-2 w-fit "
              onClick={() => setAddUser(false)}
            >
              Add Expense
            </p>
          )}
          {!addUser && comingData.length > 0 && (
            <CreateExpense users={comingData} />
          )}
          {comingData.length === 0 && (
            <p className="mt-2 ">
              Please atleast add one user name to continue
            </p>
          )}
          {!addUser && (
            <p
              className="text-blue-400 font-bold cursor-pointer mt-2 w-fit"
              onClick={() => setAddUser(true)}
            >
              Add users
            </p>
          )}
        </SheetDetailsCard>
      </div>
      <Outlet />
      <Footer />
    </div>
  );
};

export default SingleSheet;
