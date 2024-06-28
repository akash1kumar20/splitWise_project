import { FaRegCopyright } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-slate-600 text-slate-400 flex justify-center items-center text-md fixed bottom-0 w-full">
      <FaRegCopyright />
      <h4 className="ms-1">Akash Kumar</h4>
    </div>
  );
};

export default Footer;
