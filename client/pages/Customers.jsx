import customersApi from "../api/customersApi";
import { useQuery } from "@tanstack/react-query";
import { Box, CircularProgress, Typography } from "@mui/material";
import DataTable from "../components/DataTable";
import { useEffect, useState } from "react";
import Notify from "../components/Notify";

const Customer = () => {
  const [notify, setNotify] = useState({ message: "", severity: "info" });

  const {
    data: customers,
    isLoading,
    error,
  } = useQuery({
    queryFn: customersApi.getCustomers,
    queryKey: ["customers"],
  });

  useEffect(() => {
    if (error) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNotify({
        message: `Error: ${error.status}: ${error.message}`,
        severity: "error",
      });
    }
  }, [error]);

  const columns = [
    {
      key: "name",
      header: "Name",
    },
    {
      key: "address",
      header: "Address",
    },
    {
      key: "phoneNumber",
      header: "Phone Number",
    },
    {
      key: "startDate",
      header: "Start Date",
      render: (row) => new Date(row.startDate).toLocaleDateString(),
    },
  ];

  return (
    <Box>
      <Box display="grid" alignItems="center" mb={3}>
        <Typography variant="h3" textAlign="center">
          Customers
        </Typography>

        <Box />
      </Box>
      {isLoading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <DataTable columns={columns} data={customers} />
      )}
      <Notify
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ message: "", severity: "info" })}
      />
    </Box>
  );
};
export default Customer;
