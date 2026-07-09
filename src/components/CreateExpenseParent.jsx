import Loading from "../ExtraComponents/Loading";
import Users from "../ExtraComponents/Users";
import useFetchDataHook from "../customHooks/useFetchDataHook";
import CreateExpense from "../Expenses/CreateExpense";
import { useState } from "react";
import { useSelector } from "react-redux";
import SheetDetailsCard from "../Card/SheetDetailsCard";
import { useNavigate } from "react-router-dom";

const CreateExpenseParent = ({ onExpenseAdded }) => {
  const inviteCode = useSelector((s) => s.expenseSheet.inviteCode);
  const [addUser, setAddUser] = useState(false);
  const sheetType = localStorage.getItem("sp_sheetType") || "split";
  const isPersonal = sheetType === "personal";

  const [comingData, isLoading, , refetch] = useFetchDataHook(
    `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${inviteCode}/usersList.json`,
    5000, // poll every 5s — other users' additions appear automatically
  );

  const navigate = useNavigate();
  const sheetCode = useSelector((s) => s.expenseSheet.sheetCode);

  return (
    <SheetDetailsCard>
      {isLoading && <Loading />}
      {!isLoading && (
        <div>
          {/* Add users section — hidden for personal sheets */}
          {!isPersonal && addUser && (
            <Users existingUsers={comingData} onUserAdded={refetch} />
          )}
          {!isPersonal && comingData.length > 0 && addUser && (
            <p
              className="text-blue-400 font-bold cursor-pointer mt-2 w-fit"
              onClick={() => setAddUser(false)}
            >
              Add Expense
            </p>
          )}

          {/* Expense form */}
          {(!addUser || isPersonal) && comingData.length > 0 && (
            <CreateExpense
              users={comingData}
              onExpenseAdded={onExpenseAdded}
              isPersonal={isPersonal}
            />
          )}

          {comingData.length === 0 && !isPersonal && (
            <p className="mt-2">
              Please add at least one user name to continue
            </p>
          )}

          {!isPersonal && !addUser && (
            <div
              className={`flex flex-nowrap items-center gap-3 ${
                comingData.length > 0 ? "mx-auto w-full max-w-[80%]" : "w-full"
              }`}
            >
              <p
                className="mt-2 w-fit cursor-pointer whitespace-nowrap rounded-lg border-2 border-blue-600 px-1 text-sm font-bold text-blue-400"
                onClick={() => setAddUser(true)}
              >
                Add users
              </p>
              {comingData.length > 1 && (
                <p
                  className="mt-2 w-fit cursor-pointer whitespace-nowrap rounded-lg border-2 border-blue-600 px-1 text-sm font-bold text-blue-400"
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
