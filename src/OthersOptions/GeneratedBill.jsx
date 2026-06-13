import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useFetchDataHook from "../customHooks/useFetchDataHook";
import Loading from "../ExtraComponents/Loading";
import { useReactToPrint } from "react-to-print";
import TableHead from "../ExtraComponents/TableHead";
import TableBody from "../ExtraComponents/TableBody";
import axios from "axios";
import HowCalculate from "../ExtraComponents/HowCalculate";
import useAdminStatus from "../customHooks/useAdminStatus";
import { expenseSheetActions } from "../../store/expenseSheetSlice";

const sKey = (s) => `${s.from}__${s.to}`;

const calcSettlements = (resultData, totalAmt, userCount) => {
  if (!resultData.length || !userCount) return [];
  const perHead = totalAmt / userCount;
  let creditors = [],
    debtors = [];
  resultData.forEach((item) => {
    const bal = parseFloat((item.finalAmount - perHead).toFixed(2));
    if (bal > 0.01) creditors.push({ user: item.user, balance: bal });
    if (bal < -0.01) debtors.push({ user: item.user, balance: -bal });
  });
  creditors.sort((a, b) => b.balance - a.balance);
  debtors.sort((a, b) => b.balance - a.balance);
  const settlements = [];
  let i = 0,
    j = 0;
  while (i < debtors.length && j < creditors.length) {
    const amt = parseFloat(
      Math.min(debtors[i].balance, creditors[j].balance).toFixed(2),
    );
    if (amt > 0.01)
      settlements.push({
        from: debtors[i].user,
        to: creditors[j].user,
        amount: amt,
      });
    debtors[i].balance = parseFloat((debtors[i].balance - amt).toFixed(2));
    creditors[j].balance = parseFloat((creditors[j].balance - amt).toFixed(2));
    if (debtors[i].balance < 0.01) i++;
    if (creditors[j].balance < 0.01) j++;
  }
  return settlements;
};

const GeneratedBill = () => {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.expenseSheet.token);
  const navigate = useNavigate();
  const details = useRef();

  const sheetCode = useSelector((s) => s.expenseSheet.sheetCode);
  const code =
    useSelector((s) => s.expenseSheet.inviteCode) ||
    localStorage.getItem("sp_inviteCode") ||
    "";
  const urlKey = `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${code}`;
  const userMail =
    useSelector((s) => s.expenseSheet.userMail) ||
    localStorage.getItem("sp_userMail") ||
    "";

  // isAdmin: hook (localStorage fallback) + Firebase fetch as final safety net
  const { isAdmin: isAdminHook } = useAdminStatus();
  const [sheetAdminResolved, setSheetAdminResolved] = useState(
    localStorage.getItem("sp_sheetAdmin") || "",
  );
  const isAdmin =
    isAdminHook ||
    (!!userMail && !!sheetAdminResolved && userMail === sheetAdminResolved);

  useEffect(() => {
    const local = localStorage.getItem("sp_sheetAdmin");
    if (local) {
      setSheetAdminResolved(local);
      return;
    }
    if (!code) return;
    axios
      .get(`${urlKey}/sheetDetails.json`)
      .then((res) => {
        if (res.data) {
          const firstKey = Object.keys(res.data)[0];
          const admin = res.data[firstKey]?.userMail;
          if (admin) {
            setSheetAdminResolved(admin);
            localStorage.setItem("sp_sheetAdmin", admin);
            dispatch(expenseSheetActions.setSheetAdmin(admin));
          }
        }
      })
      .catch(() => {});
  }, [code]);

  useEffect(() => {
    if (!token) navigate("/");
  }, []);

  const [comingData, isLoading] = useFetchDataHook(
    `${urlKey}/expenseSheet.json`,
  );
  const [users, setUsers] = useState([]);
  const [result, setResult] = useState([]);

  useEffect(() => {
    axios
      .get(`${urlKey}/usersList.json`)
      .then((res) => {
        const arr = [];
        for (let key in res.data) arr.push({ ...res.data[key], id: key });
        setUsers(arr);
      })
      .catch(console.error);
  }, []);

  const dataArray = comingData.map((i) => i.date);
  const startingDate = dataArray[0];
  const endingDate = dataArray[dataArray.length - 1];
  const today = new Date().toLocaleDateString();
  const relatedMoneyTtl = comingData.reduce(
    (s, i) => s + (Number(i.relatedAmtVal) || 0),
    0,
  );
  const totalAmount = comingData.reduce(
    (s, i) => s + (Number(i.amount) || 0),
    0,
  );
  const grandTotal = totalAmount + relatedMoneyTtl;
  const perHead = users.length
    ? (totalAmount / users.length).toFixed(2) * 1
    : 0;

  useEffect(() => {
    const userMap = comingData.reduce((acc, item) => {
      const { user, relatedTo } = item;
      const amt = parseFloat(item.amount) || 0;
      const rl = parseFloat(item.relatedAmtVal) || 0;
      if (!acc[user])
        acc[user] = { amount: 0, relatedAmtVal: 0, relatedToAmtVal: 0 };
      if (!acc[relatedTo])
        acc[relatedTo] = { amount: 0, relatedAmtVal: 0, relatedToAmtVal: 0 };
      acc[user].amount += amt;
      acc[user].relatedAmtVal += rl;
      acc[relatedTo].relatedToAmtVal += rl;
      return acc;
    }, {});
    setResult(
      Object.keys(userMap).map((user) => {
        const { amount, relatedAmtVal, relatedToAmtVal } = userMap[user];
        return {
          user,
          finalAmount: amount + relatedAmtVal - relatedToAmtVal,
          userAmount: amount,
          userRelatedAmtVal: relatedAmtVal,
          relatedToAmtVal,
        };
      }),
    );
  }, [comingData]);

  const settlements = calcSettlements(result, totalAmount, users.length);

  // Settlement paid status — Firebase-persisted, polled every 5s
  const [paidMap, setPaidMap] = useState({});

  useEffect(() => {
    if (!code) return;
    const load = () =>
      axios
        .get(`${urlKey}/settlementPaid.json`)
        .then((res) => {
          if (res.data && typeof res.data === "object") setPaidMap(res.data);
        })
        .catch(() => {});
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [code]);

  const togglePaid = async (s) => {
    if (!isAdmin) return;
    const key = sKey(s);
    const newMap = { ...paidMap, [key]: !paidMap[key] };
    setPaidMap(newMap);
    await axios.put(`${urlKey}/settlementPaid.json`, newMap);
  };

  const allSettled =
    settlements.length === 0 || settlements.every((s) => paidMap[sKey(s)]);

  const [balanceCal, setBalanceCal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const printAndSave = useReactToPrint({
    content: () => details.current,
    documentTitle: `${startingDate} to ${endingDate}`,
    onAfterPrint: () => afterPDFPrint(),
  });

  const afterPDFPrint = async () => {
    try {
      const res = await axios.post(`${urlKey}/previousBills.json`, {
        totalAmount,
        relatedMoneyTtl,
        generatedBy: userMail,
        totalUsers: users.length,
        data: result,
        startingDate,
        endingDate,
        generatedAt: today,
      });
      if (res.status === 200) {
        await axios.delete(`${urlKey}/expenseSheet.json`);
        await axios.delete(`${urlKey}/settlementPaid.json`);
        navigate(`/home/sheets/${sheetCode}`);
      }
    } catch {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(56,102,65)]">
      {isLoading && <Loading />}

      {!isLoading && (
        <div className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm sticky top-0 z-10">
          <button
            className="text-sm bg-gray-800 text-white px-4 py-2 rounded-xl hover:bg-gray-700"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold text-gray-800">Bill Summary</h1>
          <div className="w-20" />
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-2xl p-6 mx-4 max-w-sm w-full text-center shadow-2xl">
            <p className="text-3xl mb-2">⚠️</p>
            <h2 className="text-xl font-bold mb-2">Generate New Bill?</h2>
            <p className="text-sm text-gray-600 mb-4">
              This will <strong>permanently delete all current expenses</strong>
              . Download the PDF first.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                className="bg-green-600 text-white px-5 py-2 rounded-xl font-semibold"
                onClick={() => {
                  setShowConfirm(false);
                  printAndSave();
                }}
              >
                Yes, Confirm
              </button>
              <button
                className="bg-gray-200 text-gray-800 px-5 py-2 rounded-xl font-semibold"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {!isLoading && comingData.length === 0 && (
        <p className="text-center text-2xl font-bold text-white mt-20">
          No expenses found.
        </p>
      )}

      {!isLoading && comingData.length > 0 && (
        <div className="max-w-3xl mx-auto px-4 pb-12 pt-6">
          <div ref={details}>
            <div className="hidden md:block bg-white rounded-2xl shadow border border-gray-100 p-4 mb-4">
              <TableHead />
              <TableBody comingData={comingData} />
            </div>

            {/* Bill summary */}
            <div className="bg-white font-semibold rounded-2xl shadow border border-gray-100 p-6 mb-4">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                Bill Details
              </h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-600 mb-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase">Time Frame</p>
                  <p className="font-semibold text-gray-800">
                    {startingDate} → {endingDate}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase">
                    Generated On
                  </p>
                  <p className="font-semibold text-gray-800">{today}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase">Total Users</p>
                  <p className="font-semibold text-gray-800">{users.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase">
                    Per Head (excl. F&L)
                  </p>
                  <p className="font-semibold text-gray-800">₹{perHead}</p>
                </div>
              </div>
              <div className="border-t pt-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Total Expense</span>
                  <span className="text-2xl font-extrabold text-gray-900">
                    ₹{grandTotal}
                  </span>
                </div>
                {relatedMoneyTtl > 0 && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">F&L Amount</span>
                      <span className="font-semibold text-gray-700">
                        ₹{relatedMoneyTtl}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Without F&L</span>
                      <span className="font-semibold text-gray-700">
                        ₹{totalAmount}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Contribution breakdown */}
            {result.length > 0 && (
              <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 mb-4 overflow-x-auto">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                  💼 Contribution Breakdown
                </h2>
                <table className="w-full text-sm min-w-[340px]">
                  <thead>
                    <tr className="text-xs text-gray-400 uppercase border-b">
                      <th className="text-left pb-2">User</th>
                      <th className="text-right pb-2">Direct</th>
                      <th className="text-right pb-2">F&L Given</th>
                      <th className="text-right pb-2">F&L Rcvd</th>
                      <th className="text-right pb-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.map((item) => (
                      <tr key={item.user} className="border-b last:border-0">
                        <td className="py-2 font-semibold text-gray-800">
                          {item.user}
                        </td>
                        <td className="py-2 text-right text-gray-600">
                          ₹{item.userAmount}
                        </td>
                        <td className="py-2 text-right text-green-600">
                          {item.userRelatedAmtVal > 0
                            ? `₹${item.userRelatedAmtVal}`
                            : "—"}
                        </td>
                        <td className="py-2 text-right text-orange-500">
                          {item.relatedToAmtVal > 0
                            ? `₹${item.relatedToAmtVal}`
                            : "—"}
                        </td>
                        <td className="py-2 text-right font-bold text-gray-900">
                          ₹{item.userAmount + item.userRelatedAmtVal}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-gray-400 mt-3">
                  F&L Given = paid for others. F&L Rcvd = others paid for you.
                </p>
              </div>
            )}

            {/* Who Pays Whom */}
            <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 mb-4">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                💸 Who Pays Whom
              </h2>
              {settlements.length === 0 ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-6 text-center">
                  <p className="text-4xl mb-2">🎉</p>
                  <p className="text-lg font-bold text-green-700">
                    Everyone is settled!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {settlements.map((s, i) => {
                    const paid = !!paidMap[sKey(s)];
                    return (
                      <div
                        key={i}
                        className={`flex items-center justify-between rounded-2xl px-5 py-4 border transition-all ${paid ? "bg-green-50 border-green-300 opacity-70" : "bg-gray-50 border-gray-200"}`}
                      >
                        <div className="text-center min-w-[80px]">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                            Pays
                          </p>
                          <p
                            className={`text-lg font-extrabold ${paid ? "line-through text-gray-400" : "text-red-500"}`}
                          >
                            {s.from}
                          </p>
                        </div>
                        <div className="flex flex-col items-center flex-1">
                          <p className="text-2xl font-black text-gray-900">
                            ₹{s.amount}
                          </p>
                          <p className="text-xl text-gray-400 mt-1">→</p>
                          {isAdmin ? (
                            <button
                              className={`text-xs mt-2 px-3 py-1 rounded-full font-semibold border transition-all
                                ${
                                  paid
                                    ? "bg-green-600 text-white border-green-600 hover:bg-red-500 hover:border-red-500"
                                    : "bg-white text-gray-600 border-gray-300 hover:border-green-500 hover:text-green-600"
                                }`}
                              onClick={() => togglePaid(s)}
                              title={
                                paid
                                  ? "Click to mark as Unpaid"
                                  : "Click to mark as Paid"
                              }
                            >
                              {paid ? "✓ Paid — Undo" : "Mark as Paid"}
                            </button>
                          ) : (
                            <span
                              className={`text-xs mt-2 px-3 py-1 rounded-full font-semibold
                              ${paid ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                            >
                              {paid ? "✓ Paid" : "Unpaid"}
                            </span>
                          )}
                        </div>
                        <div className="text-center min-w-[80px]">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                            Receives
                          </p>
                          <p
                            className={`text-lg font-extrabold ${paid ? "text-gray-400" : "text-green-600"}`}
                          >
                            {s.to}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {allSettled && settlements.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 text-center text-green-700 font-semibold text-sm">
                      🎉 All settlements paid — ready to generate new bill!
                    </div>
                  )}
                  <p className="text-xs text-gray-400 text-center mt-1 font-semibold">
                    ✓ Once everyone pays, all balances are cleared.
                  </p>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="bg-white rounded-2xl shadow border border-gray-100 px-6 py-4 mb-4">
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-green-600 inline-block" />
                  Amount to Receive
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-red-600 inline-block" />
                  Amount to Give
                </span>
                <span>P/M — Pay Method</span>
                <span>F&L — Favours &amp; Lending</span>
              </div>
            </div>
          </div>

          <div className="text-center mb-4">
            <button
              className="text-sm bg-blue-600 text-white p-1 rounded-md underline"
              onClick={() => setBalanceCal((b) => !b)}
            >
              How is Balance Calculated?
            </button>
          </div>
          {balanceCal && (
            <HowCalculate balanceCalHandler={() => setBalanceCal(false)} />
          )}

          <div className="flex gap-3 justify-center flex-wrap">
            {isAdmin ? (
              allSettled ? (
                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-2xl shadow-lg"
                  onClick={() => setShowConfirm(true)}
                >
                  ✓ Generate New Bill
                </button>
              ) : (
                <div className="bg-orange-50 border border-orange-300 text-orange-800 text-sm px-5 py-3 rounded-2xl text-center max-w-xs">
                  ⏳ Mark all settlements as <strong>Paid</strong> before
                  generating a new bill.
                </div>
              )
            ) : (
              <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm px-5 py-3 rounded-2xl">
                🔒 Only the <strong>sheet admin</strong> can generate the bill.
              </div>
            )}
            <button
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-8 py-3 rounded-2xl shadow-lg"
              onClick={() => navigate(-1)}
            >
              + Add More
            </button>
          </div>
          <p className="text-center text-xs text-white mt-4">
            Download the PDF before generating a new bill.
          </p>
        </div>
      )}
    </div>
  );
};

export default GeneratedBill;
