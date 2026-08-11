import CustomTutorial from "./CustomTutorial";

const steps = [
  {
    target: "#tutorial-invite-code",
    content: (
      <div>
        <p className="font-bold mb-1">🔗 Invite Code</p>
        <p className="text-gray-600">
          Share this code with your group. They can use
          "Find Sheet" on the home screen to join and
          track expenses together.
        </p>
      </div>
    ),
  },
  {
    target: "#tutorial-add-users",
    content: (
      <div>
        <p className="font-bold mb-1">👥 Add Users First</p>
        <p className="text-gray-600">
          Add names of everyone in the group. These names
          appear in "Spend By" when logging expenses.
        </p>
      </div>
    ),
  },
  {
    target: "#tutorial-expense-form",
    content: (
      <div>
        <p className="font-bold mb-1">💰 Add Expenses</p>
        <p className="text-gray-600">
          Fill in category, amount, who spent it, and
          payment method. Hit <strong>Add</strong> — it
          appears instantly below.
        </p>
      </div>
    ),
  },
  {
    target: "#tutorial-favours",
    content: (
      <div>
        <p className="font-bold mb-1">🤝 Favours & Lending</p>
        <p className="text-gray-600">
          For loans or direct payments — when one person
          pays for another, not as a shared group expense.
        </p>
      </div>
    ),
  },
  {
    target: "#tutorial-other-options",
    content: (
      <div>
        <p className="font-bold mb-1">⚙️ More Options</p>
        <p className="text-gray-600">
          Access <strong>Generate Bill</strong> (admin only),
          filter expenses, view previous bills, and manage users.
        </p>
      </div>
    ),
  },
];

const SheetTutorial = () => (
  <CustomTutorial
    steps={steps}
    storageKey="sp_sheet_tutorial_done"
    delay={1000}
  />
);

export default SheetTutorial;
