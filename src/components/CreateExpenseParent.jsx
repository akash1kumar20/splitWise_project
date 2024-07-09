import Loading from "../ExtraComponents/Loading";
import Users from "../ExtraComponents/Users";
import useFetchDataHook from "../customHooks/useFetchDataHook";
import CreateExpense from "../Expenses/CreateExpense";
import { useState } from "react";
import { useSelector } from "react-redux";

const CreateExpenseParent = () => {
  const inviteCode = useSelector((state) => state.expenseSheet.inviteCode);
  const [addUser, setAddUser] = useState(false);

  let urlKey = "usersList" + inviteCode;
  const [comingData, isLoading] = useFetchDataHook(
    `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${urlKey}.json`
  );
  return (
    <>
      {!isLoading && (
        <div>
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
        </div>
      )}
      {isLoading && <Loading />}
    </>
  );
};

export default CreateExpenseParent;
