import ReactDOM from "react-dom";
const HowCalculate = ({ balanceCalHandler }) => {
  const calHandler = () => {
    balanceCalHandler();
  };
  return ReactDOM.createPortal(
    <div className="bg-black bg-opacity-80 min-w-[100vw] text-white min-h-[100vh] fixed top-0">
      <div className="text-center md:mx-16 text-lg mx-2">
        <p
          className="text-3xl font-semibold  text-center cursor-pointer pt-4"
          onClick={() => calHandler()}
        >
          ← Back
        </p>
        <h1 className="text-2xl underline mt-16">How is Balance Calculated?</h1>
        <p>
          <b>Step 1 —</b> Add up what each user paid <br />
          Every amount paid by a user is added to their balance.
          <span>
            <br />
            For example:
            <br />
            User one spent — ₹9,250
            <br />
            User two spent — ₹400
          </span>
        </p>
        <p>
          <b>Step 2 —</b> If an amount paid by a user is linked to another user,
          it is added to the payer's balance and deducted from the linked user's
          balance.
          <span>
            <br />
            For example:
            <br />
            User two spent ₹500 linked to user one
            <br />
            <span className="text-sm font-semibold">
              Note: If a user pays an amount linked to themselves, it is neither
              added nor deducted from the balance.
            </span>
          </span>
        </p>
        <p>
          <b>Final Balance</b> — We now have the updated balance for each user.
          <span>
            <br />
            For example:
            <br />
            User one: 9,250 − 500 = ₹8,750
            <br />
            User two: 400 + 500 = ₹900
          </span>
        </p>
        <p>
          <b>Step 3 —</b> Subtract the per head contribution from each user's
          balance to get their final settlement amount.
          <span>
            <br />
            For example:
            <br />
            Per head contribution (excl. F&L): ₹9,650 ÷ 2 users = ₹4,825
            <br />
            Balance of user one: 8,750 − 4,825 = ₹3,925
            <br />
            Balance of user two: 900 − 4,825 = −₹3,925
            <br />A negative amount shown in red means that user needs to give
            that amount to the other user.
          </span>
        </p>
      </div>
    </div>,
    document.querySelector("#balanceCal"),
  );
};

export default HowCalculate;
