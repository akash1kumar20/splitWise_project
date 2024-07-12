import { useNavigate } from "react-router-dom";

const OthersComponentCard = (props) => {
  const navigate = useNavigate();
  return (
    <div className="bg-black bg-opacity-70 text-white min-h-[100vh] py-[1%]">
      <div className="flex justify-center items-center">
        <p
          className="text-3xl font-semibold w-fit  bg-black mb-3 shadow-black p-3 
        rounded-xl"
          onClick={() => navigate(-1)}
        >
          X
        </p>
      </div>

      <div className="md:w-[50%] wd-[90%] mx-auto border-2 border-slate-500 rounded-xl py-3 px-10 flex justify-center items-center gap-4 flex-col">
        {props.children}
      </div>
    </div>
  );
};

export default OthersComponentCard;
