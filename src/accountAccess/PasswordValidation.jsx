import { useEffect, useState } from "react";
import { GrCheckboxSelected } from "react-icons/gr";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { useDispatch } from "react-redux";
import { passwordSliceAction } from "../../store/passwordSlice";

const PasswordValidation = ({ password }) => {
  let [validNumber, setValidNumber] = useState(false);
  let [validUpperCase, setValidUpperCase] = useState(false);
  let [validLowerCase, setValidLowerCase] = useState(false);
  let [validSpecialChar, setValidSpecialChar] = useState(false);
  let [validLength, setValidLength] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyPasswordHandler = (password) => {
      let lower = new RegExp("(?=.*[a-z])");
      let upper = new RegExp("(?=.*[A-Z])");
      let number = new RegExp("(?=.*[0-9])");
      let special = new RegExp("(?=.*[!@#$%^&*])");
      let length = new RegExp("(?=.{8,})");

      if (lower.test(password)) {
        setValidLowerCase(true);
      } else {
        setValidLowerCase(false);
      }

      if (upper.test(password)) {
        setValidUpperCase(true);
      } else {
        setValidUpperCase(false);
      }

      if (number.test(password)) {
        setValidNumber(true);
      } else {
        setValidNumber(false);
      }

      if (special.test(password)) {
        setValidSpecialChar(true);
      } else {
        setValidSpecialChar(false);
      }

      if (length.test(password)) {
        setValidLength(true);
      } else {
        setValidLength(false);
      }
    };
    if (password.length > 0) {
      verifyPasswordHandler(password);
    }
    dispatchToggle();
  }, [password]);
  function dispatchToggle() {
    if (
      validLength &&
      validLowerCase &&
      validNumber &&
      validSpecialChar &&
      validUpperCase
    ) {
      dispatch(passwordSliceAction.submitPasswordToggle(true));
    } else {
      dispatch(passwordSliceAction.submitPasswordToggle(false));
    }
  }

  return (
    <div className="mt-1 text-xs font-semibold ">
      <p>Password Must Have Atleast</p>
      <p
        className={
          validLength
            ? "text-green-600 flex justify-center items-center"
            : "text-red-600 flex justify-center items-center"
        }
      >
        Atleast 8 Characters
        <span className="ms-2">
          {validLength ? <GrCheckboxSelected /> : <MdCheckBoxOutlineBlank />}
        </span>
      </p>
      <p
        className={
          validNumber
            ? "text-green-600 flex justify-center items-center"
            : "text-red-600 flex justify-center items-center"
        }
      >
        One Number (0-9)
        <span className="ms-2">
          {validNumber ? <GrCheckboxSelected /> : <MdCheckBoxOutlineBlank />}
        </span>
      </p>
      <p
        className={
          validUpperCase
            ? "text-green-600 flex justify-center items-center"
            : "text-red-600 flex justify-center items-center"
        }
      >
        One Capital Letter (A-Z)
        <span className="ms-2">
          {validUpperCase ? <GrCheckboxSelected /> : <MdCheckBoxOutlineBlank />}
        </span>
      </p>
      <p
        className={
          validLowerCase
            ? "text-green-600 flex justify-center items-center"
            : "text-red-600 flex justify-center items-center"
        }
      >
        One Lower Letter (a-z)
        <span className="ms-2">
          {validLowerCase ? <GrCheckboxSelected /> : <MdCheckBoxOutlineBlank />}
        </span>
      </p>
      <p
        className={
          validSpecialChar
            ? "text-green-600 flex justify-center items-center"
            : "text-red-600 flex justify-center items-center"
        }
      >
        One Special Character (@,#,%,etc.)
        <span className="ms-2">
          {validSpecialChar ? (
            <GrCheckboxSelected />
          ) : (
            <MdCheckBoxOutlineBlank />
          )}
        </span>
      </p>
    </div>
  );
};

export default PasswordValidation;
