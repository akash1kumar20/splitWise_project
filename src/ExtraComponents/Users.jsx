import axios from "axios";
import { useRef } from "react";
import { useSelector } from "react-redux";

const Users = () => {
  const nameRef = useRef();
  const invitationCode = useSelector((state) => state.expenseSheet.inviteCode);

  const addUsersList = async (e) => {
    e.preventDefault();
    const users = {
      userName: nameRef.current.value,
    };
    try {
      let res = await axios.post(
        `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${invitationCode}/usersList.json`,
        users
      );
      if (res.status === 200) {
        nameRef.current.value = `${nameRef.current.value} added`;
      }
    } catch (error) {
      nameRef.current.value = "Please try again";
    }
    setTimeout(() => {
      nameRef.current.value = "";
    }, 1000);
  };
  return (
    <>
      <input
        name="user"
        type="text"
        required
        ref={nameRef}
        placeholder="Add User Here"
        className="bg-slate-400 text-white font-bold py-2 ps-2 rounded-lg placeholder:text-white placeholder:font-bold focus:outline-none"
      />
      <button
        className="bg-purple-600 text-white ms-2 py-2 px-6 rounded-2xl font-bold"
        onClick={(e) => addUsersList(e)}
      >
        Add
      </button>
    </>
  );
};

export default Users;
