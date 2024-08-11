import Loading from "../ExtraComponents/Loading";
import Users from "../ExtraComponents/Users";
import useFetchDataHook from "../customHooks/useFetchDataHook";
import CreateExpense from "../Expenses/CreateExpense";
import { useState } from "react";
import { useSelector } from "react-redux";
import SheetDetailsCard from "../Card/SheetDetailsCard";
import { useNavigate } from "react-router-dom";

const CreateExpenseParent = () => {
  const inviteCode = useSelector((state) => state.expenseSheet.inviteCode);
  const [addUser, setAddUser] = useState(false);
  const [comingData, isLoading] = useFetchDataHook(
    `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${inviteCode}/usersList.json`
  );
  const navigate = useNavigate();
  const sheetCode = useSelector((state) => state.expenseSheet.sheetCode);
  return (
    <SheetDetailsCard>
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
            <div className="flex gap-x-3">
              <p
                className="text-blue-400 font-bold cursor-pointer mt-2 w-fit"
                onClick={() => setAddUser(true)}
              >
                Add users
              </p>
              {comingData.length > 1 && (
                <p
                  className="text-blue-400 font-bold cursor-pointer mt-2 w-fit"
                  onClick={() =>
                    navigate(`/home/sheets/${sheetCode}/otherExpense`)
                  }
                >
                  Other Expense
                </p>
              )}
            </div>
          )}
        </div>
      )}
      {isLoading && <Loading />}
    </SheetDetailsCard>
  );
};

export default CreateExpenseParent;
