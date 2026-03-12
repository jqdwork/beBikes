import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import salesApi from "../api/salesApi";
import DataTable from "../components/DataTable";
import { buildSalesReport } from "../utils/reportUtils";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import { BarChart } from "@mui/x-charts";

const Report = () => {
  const [quarter, setQuarter] = useState("");

  const { data: sales = [] } = useQuery({
    queryKey: ["sales"],
    queryFn: salesApi.getSales,
  });

  const { quarters, labels, values, summaryRows } = useMemo(
    () => buildSalesReport(sales, quarter),
    [sales, quarter],
  );

  const columns = [
    {
      key: "name",
      header: "Sales Person",
    },
    {
      key: "salesCount",
      header: "Number of Sales",
    },
    {
      key: "totalCommission",
      header: "Total Commission ($)",
      render: (row) => `$${row.totalCommission.toFixed(2)}`,
    },
  ];

  return (
    <Box mt={4}>
      <Box
        mb={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h5">Quarterly Commission Report</Typography>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Quarter</InputLabel>
          <Select
            label="Quarter"
            value={quarter}
            onChange={(e) => setQuarter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {quarters.map((quarter) => (
              <MenuItem key={quarter} value={quarter}>
                {quarter}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {labels.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No sales for this period.
        </Typography>
      ) : (
        <BarChart
          height={360}
          xAxis={[{ scaleType: "band", data: labels }]}
          series={[{ data: values, label: "Commission ($)" }]}
        />
      )}
      <Divider sx={{ my: 4 }} />
      <Box mt={3}>
        <Typography variant="h6" mb={1} textAlign="center">
          Summary
        </Typography>{" "}
        <DataTable columns={columns} data={summaryRows} />
      </Box>
    </Box>
  );
};

export default Report;
