import { useEffect, useState } from "react";
import Navbar from "../ExtraComponents.jsx/Navbar";
import Footer from "../ExtraComponents.jsx/Footer";
import Profile from "../ExtraComponents.jsx/Profile";
import { useNavigate, useParams } from "react-router-dom";
import SheetDetailsCard from "../Card/SheetDetailsCard";
import axios from "axios";
import CreateExpense from "../Expenses/CreateExpense";
import { useSelector } from "react-redux";
import Users from "../ExtraComponents.jsx/Users";

const SingleSheet = () => {
  const token = useSelector((state) => state.expenseSheet.token);
  const navigate = useNavigate();
  const [sheets, setSheets] = useState([]);
  const [time, setTime] = useState(new Date());
  const [greetings, setGreetings] = useState("");
  const [users, setUsers] = useState([]);
  const [addUser, setAddUser] = useState(true);

  const timer = setInterval(() => {
    setTime(new Date());
  }, 1000);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
    let currentTime = time.getHours();
    if (currentTime >= 6 && currentTime < 12) {
      setGreetings(" Good Morning! Have a good day.");
    } else if (currentTime >= 12 && currentTime < 17) {
      setGreetings("Good Afternoon!");
    } else if (currentTime >= 17 && currentTime < 24) {
      setGreetings("Hey! Good Evening");
    } else {
      setGreetings("Good Night! Take some rest");
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

  useEffect(() => {
    const fetchUserData = async () => {
      let urlKey = "usersList" + inviteCode;
      try {
        let userRes = await axios.get(
          `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${urlKey}.json`
        );
        let userResArr = [];
        for (let key in userRes.data) {
          userResArr.push({ ...userRes.data[key], id: key });
        }
        setUsers(userResArr);
      } catch (err) {}
    };
    fetchUserData();
  }, [users]);
  return (
    <div>
      <Navbar openProfile={profileChangeHandler} />
      {openProfile && <Profile />}
      <div className="md:flex">
        <SheetDetailsCard>
          <div className="flex lg:flex-row flex-col gap-y-2 justify-between md:pe-20 pe-2  ">
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
                  <p className="text-sm md:text-lg">
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
            <div className="flex lg:flex-col flex-row gap-x-3">
              <p className="text-sm md:text-lg">{time.toDateString()}</p>
              <p className="text-sm md:text-lg">{time.toLocaleTimeString()}</p>
              <p className="text-sm md:text-lg">{greetings}</p>
            </div>
          </div>
        </SheetDetailsCard>
        <SheetDetailsCard>
          {addUser && <Users />}
          {users.length > 0 && addUser && (
            <p
              className="text-blue-400 font-bold cursor-pointer mt-2"
              onClick={() => setAddUser(false)}
            >
              Add Expense
            </p>
          )}
          {!addUser && <CreateExpense users={users} />}
          {users.length === 0 && (
            <p className="mt-2">Please atleast add one user name to continue</p>
          )}
          {!addUser && (
            <p
              className="text-blue-400 font-bold cursor-pointer mt-2"
              onClick={() => setAddUser(true)}
            >
              Add users
            </p>
          )}
        </SheetDetailsCard>
      </div>
      <Footer />
    </div>
  );
};

export default SingleSheet;
