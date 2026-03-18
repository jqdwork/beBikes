export const quarterKey = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return null;
  const quarter = Math.floor(date.getMonth() / 3) + 1;
  return `${date.getFullYear()}-Q${quarter}`;
};

export const commissionOf = (sale) => {
  const price = Number(sale.product?.salePrice ?? 0);
  const percent = Number(sale.product?.commissionPercentage ?? 0);
  return (price * percent) / 100;
};

export const buildSalesReport = (sales, selectedQuarter) => {
  const listSales = Array.isArray(sales) ? sales : [];

  const quarterSet = new Set();
  const totalsByPerson = new Map();

  for (const sale of listSales) {
    const quarter = quarterKey(sale.sales.date);
    if (!quarter) continue;
    quarterSet.add(quarter);

    if (selectedQuarter && quarter !== selectedQuarter) continue;

    const sp = sale.salePersons;
    const name = sp ? `${sp.firstName} ${sp.lastName}` : "Unknown";
    const commission = commissionOf(sale);

    if (!totalsByPerson.has(name)) {
      totalsByPerson.set(name, { name, salesCount: 0, totalCommission: 0 });
    }

    const salesStat = totalsByPerson.get(name);
    salesStat.salesCount += 1;
    salesStat.totalCommission += commission;
  }

  const summaryStats = Array.from(totalsByPerson.values())
    .map((summaryStat) => ({
      ...summaryStat,
      totalCommission: Number(summaryStat.totalCommission.toFixed(2)),
    }))
    .sort((a, b) => b.totalCommission - a.totalCommission);

  return {
    quarters: Array.from(quarterSet).sort(),
    labels: summaryStats.map((r) => r.name),
    values: summaryStats.map((r) => r.totalCommission),
    summaryStats,
  };
};
