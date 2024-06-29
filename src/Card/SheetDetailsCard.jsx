const SheetDetailsCard = (props) => {
  return (
    <div className="bg-slate-800 text-white md:w-[50%] ps-4 py-4 ">
      {props.children}
    </div>
  );
};

export default SheetDetailsCard;
