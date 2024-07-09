import { useSelector } from "react-redux";
import OthersComponentCard from "../Card/OthersComponentCard";
import useFetchDataHook from "../customHooks/useFetchDataHook";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TbTrashXFilled } from "react-icons/tb";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../ExtraComponents/Loading";

const DeleteUser = () => {
  const token = useSelector((state) => state.expenseSheet.token);
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, []);
  const code = useSelector((state) => state.expenseSheet.inviteCode);
  let urlKey = "usersList" + code;
  const [comingData, isLoading] = useFetchDataHook(
    `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${urlKey}.json`
  );

  const deleteUserHandler = async (id) => {
    try {
      let res = await axios.delete(
        `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${urlKey}/${id}.json`
      );
      if (res.status === 200) {
        toast.info("User Deleted!", {
          theme: "dark",
          position: "top-right",
          autoClose: 1000,
        });
      }
    } catch (err) {
      toast.info("Please Try Again", {
        theme: "colored",
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <OthersComponentCard>
        {isLoading && <Loading />}
        {comingData.length === 0 && !isLoading && <p>No User To Delete</p>}
        <h2 className="text-2xl font-semibold">Users:</h2>
        {comingData.map((data) => (
          <div key={data.id}>
            <p className="text-xl flex gap-5 items-center justify-between ">
              {data.userName}
              <span>
                <TbTrashXFilled
                  className="text-red-500 text-2xl shadow-lg drop-shadow-lg font-bold"
                  onClick={() => deleteUserHandler(data.id)}
                />
              </span>
            </p>
          </div>
        ))}
      </OthersComponentCard>
    </>
  );
};

export default DeleteUser;
