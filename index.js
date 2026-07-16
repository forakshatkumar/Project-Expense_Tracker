const button = document.getElementById("btn");
const typeInput = document.getElementById("type");
const amountInput = document.getElementById("amount");

const list = document.getElementById("makelist");
const totalDisplay = document.getElementById("calctotal");
const emptyMessage = document.getElementById("emptyMessage");
const expenseCount = document.getElementById("expenseCount");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const colors = [
  "#8B5CF6",
  "#3B82F6",
  "#22C55E",
  "#F97316",
  "#EC4899",
  "#06B6D4",
  "#FACC15",
  "#EF4444",
  "#14B8A6",
  "#6366F1",
  "#A855F7",
  "#10B981",
];

const chart = new Chart("myChart", {
  type: "pie",
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: colors,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "white",
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Expense Breakdown",
        color: "white",
        font: {
          size: 20,
        },
      },
    },
  },
});

button.addEventListener("click", addExpense);

function addExpense() {
  const type = typeInput.value.trim();
  const amount = Number(amountInput.value);

  if (type === "" || amountInput.value.trim() === "") {
    alert("Please fill all the fields.");
    return;
  }

  if (amount <= 0 || isNaN(amount)) {
    alert("Enter a valid amount.");
    return;
  }

  expenses.push({
    id: Date.now(),
    type,
    amount,
  });

  saveExpenses();

  typeInput.value = "";
  amountInput.value = "";
  typeInput.focus();

  renderExpenses();
}

function renderExpenses() {
  list.innerHTML = "";

  let total = 0;

  const categoryTotals = {};

  if (expenses.length === 0) {
    emptyMessage.style.display = "flex";
  } else {
    emptyMessage.style.display = "none";
  }

  expenses.forEach((expense) => {
    total += expense.amount;

    categoryTotals[expense.type] =
      (categoryTotals[expense.type] || 0) + expense.amount;

    const li = document.createElement("li");

    li.innerHTML = `
            <span class="type">${expense.type}</span>

            <div style="display:flex;align-items:center;gap:15px;">

                <span class="price">
                    ₹${expense.amount.toLocaleString("en-IN")}
                </span>

                <button class="delete-btn">
                    <i class="fa-solid fa-trash"></i>
                </button>

            </div>
        `;

    li.querySelector(".delete-btn").addEventListener("click", () => {
      expenses = expenses.filter((item) => item.id !== expense.id);

      saveExpenses();

      renderExpenses();
    });

    list.appendChild(li);
  });

  totalDisplay.textContent = "₹" + total.toLocaleString("en-IN");

  expenseCount.textContent = `${expenses.length} ${expenses.length === 1 ? "Item" : "Items"}`;

  chart.data.labels = Object.keys(categoryTotals);

  chart.data.datasets[0].data = Object.values(categoryTotals);

  chart.update();
}

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

renderExpenses();
