import { useSelector } from "react-redux";

const SheetDetailsCard = (props) => {
  const theme = useSelector((state) => state.theme.theme);
  return (
    <div
      className={
        theme
          ? "text-slate-800 bg-white md:w-[50%] ps-4 py-4 "
          : "bg-slate-800 text-white md:w-[50%] ps-4 py-4 "
      }
    >
      {props.children}
    </div>
  );
};

export default SheetDetailsCard;
