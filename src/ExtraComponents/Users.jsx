import axios from "axios";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FIREBASE_DB_URL } from "../config/firebase";

// ✅ FIX: Users no longer fetches its own data.
// CreateExpenseParent owns the fetch and passes existingUsers + onUserAdded down.
// This was the root cause of "user added but still shows 0" — two separate hook
// instances on the same URL meant only Users' private state updated, not the parent's.

const Users = ({ existingUsers = [], onUserAdded }) => {
  const nameRef = useRef();
  const invitationCode = useSelector((state) => state.expenseSheet.inviteCode);
  const url = `${FIREBASE_DB_URL}/${invitationCode}/usersList.json`;
  const [canAdd, setCanAdd] = useState(true);

  const addUsersList = () => {
    const isDuplicate = existingUsers.find(
      (item) => item.userName === nameRef.current.value,
    );
    if (isDuplicate === undefined) {
      addUser();
    } else {
      setCanAdd(false);
      nameRef.current.value = "";
    }
  };

  if (!canAdd) {
    setTimeout(() => setCanAdd(true), 1000);
  }

  async function addUser() {
    const users = { userName: nameRef.current.value };
    if (canAdd) {
      try {
        const res = await axios.post(url, users);
        if (res.status === 200) {
          nameRef.current.value = `${nameRef.current.value} added`;
          if (onUserAdded) onUserAdded(); // ✅ refetches CreateExpenseParent's data
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
        onClick={addUsersList}
      >
        Add
      </button>
      {!canAdd && <p className="mt-1 text-sm text-red-400">This user already exists...</p>}
    </>
  );
};

export default Users;
