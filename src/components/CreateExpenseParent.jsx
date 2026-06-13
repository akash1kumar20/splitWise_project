import Loading from "../ExtraComponents/Loading";
import Users from "../ExtraComponents/Users";
import useFetchDataHook from "../customHooks/useFetchDataHook";
import CreateExpense from "../Expenses/CreateExpense";
import { useState } from "react";
import { useSelector } from "react-redux";
import SheetDetailsCard from "../Card/SheetDetailsCard";
import { useNavigate } from "react-router-dom";

const CreateExpenseParent = ({ onExpenseAdded }) => {
  const inviteCode = useSelector((state) => state.expenseSheet.inviteCode);
  const [addUser, setAddUser] = useState(false);

  // ✅ Single source of truth for usersList — passed down to both Users and CreateExpense.
  // Previously, Users had its own separate hook instance, so its refetch() only updated
  // its own private state. Now CreateExpenseParent owns the data, and Users calls
  // the refetch via the onUserAdded prop.
  const [comingData, isLoading, , refetch] = useFetchDataHook(
    `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${inviteCode}/usersList.json`,
  );

  const navigate = useNavigate();
  const sheetCode = useSelector((state) => state.expenseSheet.sheetCode);

  return (
    <SheetDetailsCard>
      {isLoading && <Loading />}
      {!isLoading && (
        <div>
          {addUser && (
            <Users existingUsers={comingData} onUserAdded={refetch} />
          )}

          {comingData.length > 0 && addUser && (
            <p
              className="text-blue-400 font-bold cursor-pointer mt-2 w-fit"
              onClick={() => setAddUser(false)}
            >
              Add Expense
            </p>
          )}

          {!addUser && comingData.length > 0 && (
            <CreateExpense users={comingData} onExpenseAdded={onExpenseAdded} />
          )}

          {comingData.length === 0 && !addUser && (
            <p className="mt-2">Please atleast add one user name to continue</p>
          )}

          {!addUser && (
            <div className="flex gap-x-3">
              <p
                className="text-blue-400 font-bold cursor-pointer mt-2 w-fit border-2 border-blue-600 rounded-lg px-1"
                onClick={() => setAddUser(true)}
              >
                Add users
              </p>
              {comingData.length > 1 && (
                <p
                  className="text-blue-400 font-bold cursor-pointer mt-2 w-fit border-2 border-blue-600 rounded-lg px-1 "
                  onClick={() =>
                    navigate(`/home/sheets/${sheetCode}/otherExpense`)
                  }
                >
                  Favours & Lending
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </SheetDetailsCard>
  );
};

export default CreateExpenseParent;
