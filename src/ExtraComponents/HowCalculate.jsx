import ReactDOM from "react-dom";
const HowCalculate = ({ balanceCalHandler }) => {
  const calHandler = () => {
    balanceCalHandler();
  };
  return ReactDOM.createPortal(
    <div className="bg-black bg-opacity-80 text-white min-h-[100vh] fixed top-0">
      <div className="text-center md:mx-16 text-lg mx-2">
        <p
          className="text-3xl font-semibold  text-center cursor-pointer"
          onClick={() => calHandler()}
        >
          X
        </p>
        <h1 className="text-2xl underline">How Balance is Calculated?</h1>
        <p>
          <b>First!</b> In the balance - all the amount spend by the user is
          added.
          <span>
            <br />
            For example:
            <br />
            User one spend - ₹9250
            <br />
            User two spend - ₹400
          </span>
        </p>
        <p>
          <b>Second!</b> In the balance - if the amount is spend by the user
          which is related to another user, then that amount is added in the
          balance of the user who spend that amount and get deducted from the
          balance of the user to whose that amount is related.
          <span>
            <br />
            For Example:
            <br />
            User two spend ₹500 which is related to user one
            <br />
            <span className="text-sm font-semibold">
              If the user spend a amount which is related to single user and
              that amount is spend by the same user then that amount is neither
              added nor subtracted from the balance.
            </span>
          </span>
        </p>
        <p>
          <b>Final Balance</b> - Now we have the final amount in the balance of
          each user.
          <span>
            For Example:
            <br />
            So, Calculation for user one is 9250 - 500 = 8750
            <br />
            So, Calculation for user two is 400 + 500 = 900
          </span>
        </p>
        <p>
          <b>Third!</b> In the balance - Now subtract per head contribution
          amount from the final amount of the user, which give us the final
          balance of the user.
          <span>
            <br />
            For Example:
            <br />
            Now! Per Head Contribution without (R/L amount) is ₹ 9650 / 2
            (users) is ₹ 4825
            <br />
            So, balance of user one is 8750 - 4825 = 3925
            <br />
            So, balance of user two is 900 - 4825 = -3925
            <br />
            You see negative amount in the red color, this is the amount which
            is need to given by user two to user one.
          </span>
        </p>
      </div>
    </div>,
    document.querySelector("#balanceCal")
  );
};

export default HowCalculate;
