import { default as Joyride, STATUS } from "react-joyride";
import { useState, useEffect } from "react";

const TOUR_KEY = "sp_home_tutorial_done";

const steps = [
  {
    target: "body",
    placement: "center",
    disableBeacon: true,
    content: (
      <div className="text-center">
        <p className="text-2xl mb-2">👋 Welcome to SplitExpense!</p>
        <p className="text-sm text-gray-600 mt-2">
          Let us show you around in 30 seconds. You can skip anytime.
        </p>
      </div>
    ),
  },
  {
    target: "#tutorial-add-sheet",
    placement: "bottom",
    disableBeacon: true,
    content: (
      <div>
        <p className="font-bold mb-1">➕ Create a Sheet</p>
        <p className="text-sm text-gray-600">
          A sheet is like a group wallet. Create one for your trip, flat, or any
          group expense. You'll get an invite code to share with others.
        </p>
      </div>
    ),
  },
  {
    target: "#tutorial-find-sheet",
    placement: "bottom",
    disableBeacon: true,
    content: (
      <div>
        <p className="font-bold mb-1">🔍 Join a Sheet</p>
        <p className="text-sm text-gray-600">
          Got an invite code from someone? Use this to find and join their sheet
          so you can track expenses together.
        </p>
      </div>
    ),
  },
  {
    target: "#tutorial-sheets-grid",
    placement: "top",
    disableBeacon: true,
    content: (
      <div>
        <p className="font-bold mb-1">📋 Your Sheets</p>
        <p className="text-sm text-gray-600">
          All your sheets appear here. Tap any sheet to open it and start
          tracking expenses. The <strong>Admin</strong> badge means you created
          it — only admins can generate the final bill.
        </p>
      </div>
    ),
  },
];

const HomeTutorial = () => {
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Only show if user hasn't seen it before
    if (!localStorage.getItem(TOUR_KEY)) {
      // Small delay so the DOM is ready
      const t = setTimeout(() => setRun(true), 800);
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
          maxWidth: "320px",
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

export default HomeTutorial;
