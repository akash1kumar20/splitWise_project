import CustomTutorial from "./CustomTutorial";

const steps = [
  {
    target: "body",
    content: (
      <div>
        <p className="text-xl font-bold mb-2">👋 Welcome to SplitExpense!</p>
        <p className="text-gray-600">
          Let us show you around in 30 seconds.
          You can skip anytime.
        </p>
      </div>
    ),
  },
  {
    target: "#tutorial-add-sheet",
    content: (
      <div>
        <p className="font-bold mb-1">➕ Create a Sheet</p>
        <p className="text-gray-600">
          A sheet is like a group wallet. Create one for a trip,
          flat, or any group. You'll get an invite code to share.
        </p>
      </div>
    ),
  },
  {
    target: "#tutorial-find-sheet",
    content: (
      <div>
        <p className="font-bold mb-1">🔍 Join a Sheet</p>
        <p className="text-gray-600">
          Got an invite code from someone? Use this to find
          and join their sheet to track expenses together.
        </p>
      </div>
    ),
  },
  {
    target: "#tutorial-sheets-grid",
    content: (
      <div>
        <p className="font-bold mb-1">📋 Your Sheets</p>
        <p className="text-gray-600">
          All your sheets appear here. The{" "}
          <strong>Admin</strong> badge means you created it —
          only admins can generate the final bill.
        </p>
      </div>
    ),
  },
];

const HomeTutorial = () => (
  <CustomTutorial
    steps={steps}
    storageKey="sp_home_tutorial_done"
    delay={800}
  />
);

export default HomeTutorial;
