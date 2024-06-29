import React, { useEffect, useState } from "react";
import Navbar from "../ExtraComponents.jsx/Navbar";
import Footer from "../ExtraComponents.jsx/Footer";
import Profile from "../ExtraComponents.jsx/Profile";
import { useNavigate, useParams } from "react-router-dom";
import SheetDetailsCard from "../Card/SheetDetailsCard";
import axios from "axios";
import CreateExpense from "../Expenses/CreateExpense";
import { useSelector } from "react-redux";

const SingleSheet = () => {
  const navigate = useNavigate();
  const [sheets, setSheets] = useState([]);
  const [time, setTime] = useState(new Date());
  const [greetings, setGreetings] = useState("");
  const token = useSelector((state) => state.expenseSheet.token);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
    let currentTime = time.getHours();

    if (currentTime > 6 && currentTime < 12) {
      setGreetings(" Good Morning! Have a good day.");
    } else if (currentTime > 12 && currentTime < 17) {
      setGreetings("Good Afternoon!");
    } else if (currentTime > 17 && currentTime < 24) {
      setGreetings("Hey! Good Evening");
    } else {
      setGreetings("Good Night! Take some rest");
    }

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return clearInterval(timer);
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
  return (
    <div>
      <Navbar openProfile={profileChangeHandler} />
      {openProfile && <Profile />}
      <div className="md:flex">
        <SheetDetailsCard>
          <div className="flex justify-between md:pe-20 pe-2  ">
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
            <div>
              <p className="text-sm md:text-lg">{time.toDateString()}</p>
              <p className="text-sm md:text-lg">{time.toLocaleTimeString()}</p>
              <p className="text-sm md:text-lg">{greetings}</p>
            </div>
          </div>
        </SheetDetailsCard>
        <SheetDetailsCard>
          <CreateExpense />
        </SheetDetailsCard>
      </div>
      <Footer />
    </div>
  );
};

export default SingleSheet;
