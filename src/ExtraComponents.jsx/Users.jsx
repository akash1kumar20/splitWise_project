import axios from "axios";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Users = () => {
  const nameRef = useRef();
  const invitationCode = useSelector((state) => state.expenseSheet.inviteCode);

  const addUsersList = async () => {
    const users = {
      userName: nameRef.current.value,
    };
    let urlKey = "usersList" + invitationCode;

    try {
      let res = await axios.post(
        `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${urlKey}.json`,
        users
      );
      if (res.status === 200) {
        toast.success(`${nameRef.current.value} added`, {
          position: "top-right",
          autoClose: 2000,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error("Please try again", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
    }
    nameRef.current.value = "";
  };
  return (
    <>
      <ToastContainer />
      <input
        type="text"
        required
        ref={nameRef}
        placeholder="Add User Here"
        className="bg-slate-400 text-white font-bold py-2 ps-2 rounded-lg placeholder:text-white placeholder:font-bold focus:outline-none"
      />
      <button
        className="bg-purple-600 text-white ms-2 py-2 px-6 rounded-2xl font-bold"
        onClick={() => addUsersList()}
      >
        Add
      </button>
    </>
  );
};

export default Users;
