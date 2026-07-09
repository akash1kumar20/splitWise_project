import { useSelector } from "react-redux";
import useFetchDataHook from "../customHooks/useFetchDataHook";
import { useNavigate } from "react-router-dom";
import Loading from "../ExtraComponents/Loading";
import useAdminStatus from "../customHooks/useAdminStatus";

const PUSH_CHARS =
  "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_";
const decodeFirebaseDate = (pushId) => {
  try {
    let ts = 0;
    for (let i = 0; i < 8; i++)
      ts = ts * 64 + PUSH_CHARS.indexOf(pushId.charAt(i));
    return new Date(ts).toLocaleDateString();
  } catch {
    return null;
  }
};

const getMonthYear = (dateStr) => {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleString("default", { month: "long", year: "numeric" });
  } catch {
    return null;
  }
};

// Rs. used instead of rupee symbol — jsPDF's built-in Helvetica font
// does not support Unicode U+20B9 and renders it as "1"
const R = "Rs.";

const totalContributed = (item) => {
  if (typeof item.finalAmount === "number") return item.finalAmount;
  return (
    (Number(item.userAmount) || 0) +
    (Number(item.userRelatedAmtVal) || 0) -
    (Number(item.relatedToAmtVal) || 0)
  );
};

const generatePDF = async (bill, sheetAdmin, billIndex, currentSheetMeta) => {
  try {
    const { jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const generatedOn =
      bill.generatedAt || decodeFirebaseDate(bill.id) || "N/A";
    const sheetName =
      bill.sheetName || currentSheetMeta.sheetName || "Not recorded";
    const sheetType = bill.sheetType || currentSheetMeta.sheetType || "split";
    const isPersonal = sheetType === "personal";

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(
      isPersonal ? "Personal Bill Summary" : "Split Expense - Bill Summary",
      pageWidth / 2,
      18,
      {
        align: "center",
      },
    );

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    let y = 30;
    doc.text(`Bill #${billIndex + 1}`, 14, y);
    y += 7;
    doc.text(`Sheet Name: ${sheetName}`, 14, y);
    y += 7;
    doc.text(`Sheet Type: ${isPersonal ? "Personal" : "Split"}`, 14, y);
    y += 7;
    doc.text(`Admin: ${sheetAdmin}`, 14, y);
    y += 7;
    doc.text(
      `Time Frame: ${bill.startingDate || "Not recorded"} - ${bill.endingDate || "Not recorded"}`,
      14,
      y,
    );
    y += 7;
    doc.text(`Generated On: ${generatedOn}`, 14, y);
    y += 7;
    doc.text(
      `Total (incl. F&L): ${R}${(bill.totalAmount || 0) + (bill.relatedMoneyTtl || 0)}`,
      14,
      y,
    );
    y += 7;
    doc.text(`Direct Expenses: ${R}${bill.totalAmount || 0}`, 14, y);
    y += 7;
    if (bill.relatedMoneyTtl > 0) {
      doc.text(`F&L Amount: ${R}${bill.relatedMoneyTtl}`, 14, y);
      y += 7;
    }
    if (!isPersonal) {
      doc.text(`Total Users: ${bill.totalUsers}`, 14, y);
      y += 7;
      doc.text(
        `Per Head (excl. F&L): ${R}${(bill.totalAmount / bill.totalUsers).toFixed(2)}`,
        14,
        y,
      );
      y += 7;
    }

    autoTable(doc, {
      startY: y + 5,
      head: [
        [
          "User",
          "Direct Spend",
          "F&L Given",
          "F&L Received",
          "Total Contributed",
        ],
      ],
      body: (bill.data || []).map((item) => [
        item.user || "-",
        `${R}${item.userAmount || 0}`,
        item.userRelatedAmtVal > 0 ? `${R}${item.userRelatedAmtVal}` : "-",
        item.relatedToAmtVal > 0 ? `${R}${item.relatedToAmtVal}` : "-",
        `${R}${totalContributed(item)}`,
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [55, 65, 81] },
    });

    doc.save(`bill-${billIndex + 1}-${generatedOn}.pdf`);
  } catch {
    alert("Run: npm install jspdf jspdf-autotable");
  }
};

const PreviousBill = () => {
  const code = useSelector((s) => s.expenseSheet.inviteCode);
  const { isAdmin, sheetAdmin } = useAdminStatus();
  const navigate = useNavigate();
  const currentSheetMeta = {
    sheetName: localStorage.getItem("sp_sheetName") || "",
    sheetType: localStorage.getItem("sp_sheetType") || "split",
  };
  const [comingData, isLoading] = useFetchDataHook(
    `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${code}/previousBills.json`,
  );

  return (
    <div className="min-h-screen bg-[rgb(56,102,65)] pb-10">
      <div className="bg-white shadow-sm border-b px-4 py-3 sticky top-0">
        <div className="flex items-center justify-between">
          <button
            className="text-sm bg-gray-800 text-white px-4 py-2 rounded-xl hover:bg-gray-700 whitespace-nowrap"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <h1 className="text-lg font-bold text-gray-800">Previous Bills</h1>
          <div className="w-20" />
        </div>
        <p className="text-center text-xs text-gray-500 mt-1">
          Admin:{" "}
          <span className="font-semibold text-gray-700 break-all">
            {sheetAdmin || "-"}
          </span>
        </p>
      </div>

      {isLoading && <Loading />}

      {!isLoading && comingData.length === 0 && (
        <p className="text-center text-xl font-semibold text-white mt-16">
          No Previous Bills Available
        </p>
      )}

      {!isLoading &&
        comingData.map((data, i) => {
          const generatedOn =
            data.generatedAt || decodeFirebaseDate(data.id) || "-";
          const timeStart = data.startingDate || null;
          const timeEnd = data.endingDate || null;

          return (
            <div
              key={data.id}
              className="flex items-center gap-3 mx-3 md:mx-16 my-4 bg-white rounded-2xl shadow-md border border-gray-200 px-4 py-4"
            >
              <div className="flex flex-col items-center gap-2 min-w-[56px]">
                <span className="text-2xl font-extrabold text-gray-400">
                  #{i + 1}
                </span>
                {isAdmin && (
                  <button
                    className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-2 py-1.5 rounded-xl whitespace-nowrap"
                    onClick={() =>
                      generatePDF(data, sheetAdmin, i, currentSheetMeta)
                    }
                  >
                    Download PDF
                  </button>
                )}
              </div>

              <div className="w-px bg-gray-200 self-stretch" />

              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <div className="flex items-start gap-1.5 text-gray-600 text-sm">
                  <div>
                    <span className="font-medium">Time Frame: </span>
                    {timeStart && timeEnd ? (
                      <span className="break-words">
                        {timeStart} to {timeEnd}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic text-xs">
                        {getMonthYear(generatedOn) || "Not recorded"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-gray-800">
                  <span className="font-medium text-sm">Total: </span>
                  <span className="font-bold">
                    Rs.{(data.totalAmount || 0) + (data.relatedMoneyTtl || 0)}
                  </span>
                  {data.relatedMoneyTtl > 0 && (
                    <span className="text-xs text-gray-500">
                      (incl. Rs.{data.relatedMoneyTtl} F&L)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                  <span className="font-medium">Generated: </span>
                  <span>{generatedOn}</span>
                </div>
              </div>
            </div>
          );
        })}

      {!isLoading && comingData.length > 0 && (
        <p className="text-center text-xs text-white mt-4 px-4">
          Note - For full details ask the admin for the PDF.
        </p>
      )}
    </div>
  );
};

export default PreviousBill;
