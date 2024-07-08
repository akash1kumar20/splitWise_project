const Cylinder = ({ children }) => {
  return (
    <div className="relative w-64 h-64 overflow-hidden ">
      <div className="absolute inset-0 rounded-full border-4 border-gray-300 transform-gpu rotate-x-45 flex-col flex justify-evenly items-center pe-16 bg-black py-4">
        {children}
      </div>
    </div>
  );
};

export default Cylinder;
