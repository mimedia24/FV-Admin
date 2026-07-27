const TIMEZONE = "Asia/Dhaka";
const WEEK_LABELS = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

const numberValue = (value) => {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const quantity = (value) => {
  const parsed = numberValue(value);
  return parsed > 0 ? parsed : 0;
};

export const getOrderDate = (order) =>
  order?.orderDate || order?.createdAt || order?.updatedAt || null;

export const getBangladeshDateKey = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.filter((part) => part.type !== "literal").map((part) => [
      part.type,
      part.value,
    ]),
  );

  return `${values.year}-${values.month}-${values.day}`;
};

const moveDateKey = (dateKey, days) => {
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

const getWeekStartKey = (todayKey) => {
  const day = new Date(`${todayKey}T00:00:00.000Z`).getUTCDay();
  const daysSinceSaturday = (day + 1) % 7;
  return moveDateKey(todayKey, -daysSinceSaturday);
};

const emptySummary = () => ({
  count: 0,
  totalSales: 0,
  restaurantSales: 0,
  deliveryAmount: 0,
  deliveryFee: 0,
  riderTips: 0,
  riderCost: 0,
  deliveryProfit: 0,
});

const calculateOrderMoney = (order) => {
  let totalSales = 0;
  let restaurantSales = 0;

  for (const item of Array.isArray(order?.items) ? order.items : []) {
    const itemQuantity = quantity(item?.quantity);
    totalSales += itemQuantity * numberValue(item?.offerPrice);
    restaurantSales += itemQuantity * numberValue(item?.basedPrice);

    for (const addon of Array.isArray(item?.addons) ? item.addons : []) {
      const addonTotal =
        quantity(addon?.quantity) * numberValue(addon?.price);
      totalSales += addonTotal;
      restaurantSales += addonTotal;
    }
  }

  const deliveryAmount = numberValue(
    order?.deliveryAmount ?? order?.deliveryFee ?? order?.deliveryCharge,
  );
  const riderCost = numberValue(
    order?.riderFee ??
      order?.deliveryCommission ??
      order?.deliveryMargin,
  );
  const riderTips = numberValue(
    order?.riderTips ?? order?.tipAmount ?? order?.tip,
  );

  return {
    totalSales,
    restaurantSales,
    deliveryAmount,
    riderCost,
    riderTips,
    deliveryProfit: deliveryAmount - riderCost,
  };
};

const addOrder = (summary, order) => {
  const money = calculateOrderMoney(order);
  summary.count += 1;
  summary.totalSales += money.totalSales;
  summary.restaurantSales += money.restaurantSales;
  summary.deliveryAmount += money.deliveryAmount;
  summary.deliveryFee += money.deliveryAmount;
  summary.riderTips += money.riderTips;
  summary.riderCost += money.riderCost;
  summary.deliveryProfit += money.deliveryProfit;
};

export const calculateActiveDashboardStats = (
  sourceOrders,
  now = new Date(),
) => {
  const orders = (Array.isArray(sourceOrders) ? sourceOrders : []).filter(
    (order) => order?.isArchived !== true,
  );
  const todayKey = getBangladeshDateKey(now);
  const weekStartKey = getWeekStartKey(todayKey);
  const weekEndKey = moveDateKey(weekStartKey, 6);
  const monthPrefix = todayKey.slice(0, 7);

  const today = emptySummary();
  const weekly = emptySummary();
  const monthly = emptySummary();
  const weekRows = WEEK_LABELS.map((day, index) => ({
    day,
    dateKey: moveDateKey(weekStartKey, index),
    count: 0,
    totalOrders: 0,
    totalSales: 0,
    restaurantSales: 0,
    deliveryAmount: 0,
    riderTips: 0,
    riderCost: 0,
    deliveryProfit: 0,
    isUpcoming: moveDateKey(weekStartKey, index) > todayKey,
  }));
  const weekMap = new Map(weekRows.map((row) => [row.dateKey, row]));

  for (const order of orders) {
    const dateKey = getBangladeshDateKey(getOrderDate(order));
    if (!dateKey) continue;

    if (dateKey === todayKey) addOrder(today, order);
    if (dateKey.startsWith(monthPrefix)) addOrder(monthly, order);

    if (dateKey >= weekStartKey && dateKey <= weekEndKey) {
      addOrder(weekly, order);
      const weekRow = weekMap.get(dateKey);
      if (weekRow) {
        const before = weekRow.count || 0;
        addOrder(weekRow, order);
        weekRow.totalOrders = before + 1;
        delete weekRow.count;
        delete weekRow.deliveryFee;
      }
    }
  }

  return {
    activeOrderCount: orders.length,
    today,
    weekly,
    monthly,
    weekDaySales: weekRows.map(({ dateKey, ...row }) => row),
  };
};
