import axios from "axios";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import useFetchDataHook from "../customHooks/useFetchDataHook";

const Users = () => {
  const nameRef = useRef();
  const invitationCode = useSelector((state) => state.expenseSheet.inviteCode);
  let url = `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${invitationCode}/usersList.json`;
  const [comingData, isLoading] = useFetchDataHook(url);
  const [canAdd, setCanAdd] = useState(true);
  let data = Object.values(comingData);
  const addUsersList = () => {
    const isDuplicate = data.find(
      (item) => item.userName === nameRef.current.value
    );

    if (isDuplicate === undefined) {
      addUser();
    } else {
      setCanAdd(false);
      nameRef.current.value = "";
    }
  };
  if (!canAdd) {
    setTimeout(() => {
      setCanAdd(true);
    }, 1000);
  }
  async function addUser() {
    const users = {
      userName: nameRef.current.value,
    };
    if (canAdd) {
      try {
        let res = await axios.post(url, users);
        if (res.status === 200) {
          nameRef.current.value = `${nameRef.current.value} added`;
        }
      } catch (error) {
        nameRef.current.value = "Please try again";
      }

      setTimeout(() => {
        nameRef.current.value = "";
      }, 1000);
    }
  }
  return (
    <>
      {!isLoading && (
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
            onClick={(e) => addUsersList()}
          >
            Add
          </button>
        </>
      )}
      {isLoading && <p>Please Wait...</p>}
      {!canAdd && <p>This user already exists...</p>}
    </>
  );
};

export default Users;
