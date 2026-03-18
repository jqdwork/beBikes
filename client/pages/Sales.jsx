import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import salesApi from "../api/salesApi.js";
import productsApi from "../api/productsApi.js";
import customersApi from "../api/customersApi.js";
import salespersonsApi from "../api/salesPersonsApi.js";
import DataTable from "../components/DataTable.jsx";
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreateModal from "../components/CreateModal.jsx";
import Notify from "../components/Notify.jsx";
import { commissionOf } from "../utils/reportUtils.js";

const Sales = () => {
  const queryClient = useQueryClient();
  const [show, setShow] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [notify, setNotify] = useState({ message: "", severity: "info" });

  const {
    data: sales,
    isLoading: loadingList,
    error: errorList,
  } = useQuery({
    queryFn: () => salesApi.getSales(from, to),
    queryKey: ["sales", from, to],
  });

  useEffect(() => {
    if (errorList) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNotify({
        message: `Error: ${errorList.status}: ${errorList.message}`,
        severity: "error",
      });
    }
  }, [errorList]);
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: productsApi.getProducts,
  });
  const { data: customers } = useQuery({
    queryKey: ["customers"],
    queryFn: customersApi.getCustomers,
  });
  const { data: salespersons } = useQuery({
    queryKey: ["salespersons"],
    queryFn: salespersonsApi.getSalesPersons,
  });
  const createSaleMutation = useMutation({
    mutationFn: (body) => salesApi.createSale(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      setNotify({ message: "Sale created successfully", severity: "info" });
      setShow(false);
    },
  });

  const handleCreateSale = (body) => {
    createSaleMutation.mutate(body);
  };

  const columns = [
    {
      key: "product",
      header: "Product",
      render: (row) => row.products?.name,
    },
    {
      key: "customer",
      header: "Customer",
      render: (row) => `${row.customers?.name}`,
    },
    {
      key: "date",
      header: "Date",
      render: (row) => new Date(row.sales.date).toLocaleDateString(),
    },
    {
      key: "price",
      header: "Price",
      render: (row) => `$${Number(row.products?.salePrice).toFixed(2)}`,
    },
    {
      key: "salesPerson",
      header: "Salesperson",
      render: (row) =>
        `${row.salePersons?.firstName} ${row.salePersons?.lastName}`,
    },
    {
      key: "commission",
      header: "Commission",
      render: (row) => `$${commissionOf({ product: row.products }).toFixed(2)}`,
    },
  ];

  return (
    <Box>
      <Box display="grid" alignItems="center" mb={3}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ justifySelf: "start" }}
          onClick={() => setShow(true)}
        >
          Create Sale
        </Button>

        <Typography variant="h3" textAlign="center">
          Sales
        </Typography>

        <Box />
      </Box>
      <Box display="flex" gap={2} alignItems="center" mb={2}>
        <TextField
          label="From"
          type="date"
          size="small"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <TextField
          label="To"
          type="date"
          size="small"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <Button
          variant="outlined"
          onClick={() => {
            setFrom("");
            setTo("");
          }}
        >
          Clear
        </Button>
      </Box>
      {loadingList ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <DataTable columns={columns} data={sales} />
      )}
      <Notify
        message={notify.message}
        onClose={() => setNotify({ message: "", severity: "info" })}
        severity={notify.severity}
      />
      <CreateModal
        show={show}
        handleClose={() => setShow(false)}
        products={products}
        customers={customers}
        salespersons={salespersons}
        createError={
          createSaleMutation?.error ? createSaleMutation?.error.message : ""
        }
        handleCreateSale={handleCreateSale}
      />
    </Box>
  );
};
export default Sales;
