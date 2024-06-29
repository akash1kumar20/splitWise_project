import React, { useRef } from "react";
import CardComponent from "../Card/CardComponent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateSheet = () => {
  const sheetNameRef = useRef();
  const navigate = useNavigate();
  async function formSubmitHandler(event) {
    event.preventDefault();
    const sheetCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    const userMail = localStorage.getItem("user-mail");
    let changeEmail;
    if (userMail === null) {
      changeEmail = 0;
    } else {
      changeEmail = userMail.replace("@", "").replace(".", "");
    }
    const invitationCode = changeEmail + sheetCode;
    const sheetDetails = {
      code: sheetCode,
      sheetName: sheetNameRef.current.value,
      userMail: userMail,
      inviationCode: invitationCode,
    };
    try {
      let res = await axios.post(
        `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${invitationCode}.json`,
        sheetDetails
      );

      let sheetRes = await axios.post(
        `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${changeEmail}/sheets.json`,
        sheetDetails
      );
      if (res.status === 200) {
        toast.success("Sheet Created!", {
          position: "top-right",
          autoClose: 2000,
          theme: "colored",
        });

        setTimeout(() => {
          navigate("/home");
        }, 2000);
      }
    } catch (err) {
      toast.error("Please try again!", {
        theme: "colored",
        autoClose: 2000,
        position: "top-right",
      });
    }
  }
  return (
    <>
      <ToastContainer />
      <CardComponent>
        <h2 className="text-xl font-semibold">Create Your Own Sheet</h2>
        <form className="mt-4" onSubmit={(event) => formSubmitHandler(event)}>
          <input
            type="text"
            required
            ref={sheetNameRef}
            placeholder="Give a name to your sheet"
            className="py-2 ps-2 bg-slate-500 text-white focus:outline-none placeholder:text-white w-full rounded-md border border-slate-700"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-800 text-white rounded-xl mt-3"
          >
            Generate
          </button>
        </form>
      </CardComponent>
    </>
  );
};

export default CreateSheet;
