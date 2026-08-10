import Joyride, { STATUS } from "react-joyride";
import { useState, useEffect } from "react";

const TOUR_KEY = "sp_sheet_tutorial_done";

const steps = [
  {
    target: "#tutorial-invite-code",
    placement: "bottom",
    disableBeacon: true,
    content: (
      <div>
        <p className="font-bold mb-1">🔗 Invite Code</p>
        <p className="text-sm text-gray-600">
          Share this code with your group members. They can use "Find Sheet"
          on the home screen to join and track expenses together.
        </p>
      </div>
    ),
  },
  {
    target: "#tutorial-add-users",
    placement: "bottom",
    disableBeacon: true,
    content: (
      <div>
        <p className="font-bold mb-1">👥 Add Users First</p>
        <p className="text-sm text-gray-600">
          Before adding expenses, add the names of everyone in the group.
          These names appear in the "Spend By" dropdown when adding expenses.
        </p>
      </div>
    ),
  },
  {
    target: "#tutorial-expense-form",
    placement: "bottom",
    disableBeacon: true,
    content: (
      <div>
        <p className="font-bold mb-1">💰 Add Expenses</p>
        <p className="text-sm text-gray-600">
          Fill in the note, category, amount, who spent it, and payment method.
          Hit <strong>Add</strong> — the expense appears in the list below instantly.
        </p>
      </div>
    ),
  },
  {
    target: "#tutorial-favours",
    placement: "top",
    disableBeacon: true,
    content: (
      <div>
        <p className="font-bold mb-1">🤝 Favours & Lending</p>
        <p className="text-sm text-gray-600">
          Use this for loans or one-sided payments — when one person pays
          for another directly, not as a shared group expense.
        </p>
      </div>
    ),
  },
  {
    target: "#tutorial-other-options",
    placement: "top",
    disableBeacon: true,
    content: (
      <div>
        <p className="font-bold mb-1">⚙️ More Options</p>
        <p className="text-sm text-gray-600">
          Tap this button to access: <strong>Generate Bill</strong> (admin only),
          filter expenses by category, view previous bills, and manage users.
        </p>
      </div>
    ),
  },
];

const SheetTutorial = () => {
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(TOUR_KEY)) {
      const t = setTimeout(() => setRun(true), 1000);
      return () => clearTimeout(t);
    }
  }, []);

  const handleCallback = ({ status }) => {
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      localStorage.setItem(TOUR_KEY, "1");
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      scrollToFirstStep
      callback={handleCallback}
      styles={{
        options: {
          primaryColor: "#3b82f6",
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: "16px",
          padding: "20px",
          maxWidth: "300px",
        },
        buttonNext: {
          borderRadius: "10px",
          padding: "8px 18px",
          fontSize: "13px",
        },
        buttonSkip: {
          fontSize: "12px",
          color: "#9ca3af",
        },
        buttonBack: {
          fontSize: "12px",
        },
      }}
      locale={{
        back: "← Back",
        close: "Close",
        last: "Done ✓",
        next: "Next →",
        skip: "Skip tour",
      }}
    />
  );
};

export default SheetTutorial;
