import salesPersonApi from "../api/salesPersonsApi";
import { useQuery } from "@tanstack/react-query";
import { Box, CircularProgress, Typography } from "@mui/material";
import DataTable from "../components/DataTable";
import { Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import EditSalesPersonModal from "../components/EditSalesPersonsModal";
import Notify from "../components/Notify";

const SalesPerson = () => {
  const [show, setShow] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [notify, setNotify] = useState("");

  const queryClient = useQueryClient();

  const {
    data: salesPersons,
    isLoading,
    error,
  } = useQuery({
    queryFn: salesPersonApi.getSalesPersons,
    queryKey: ["salesPersons"],
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

  const {
    reset,
    isPending,
    error: mutateError,
    mutate,
  } = useMutation({
    mutationFn: ({ id, body }) => salesPersonApi.updateSalesPerson(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salesPersons"] });
      setNotify({
        message: "Sales Person updated successfully",
        severity: "success",
      });
      setSelectedPerson(null);
      setShow(false);
    },
  });

  const handleEdit = (row) => {
    setSelectedPerson(row);
    setShow(true);
  };

  const handleClose = () => {
    reset();
    setShow(false);
    setSelectedPerson(null);
  };

  const handleSave = (values) => {
    if (!selectedPerson) return;

    const body = {
      ...values,
      id: selectedPerson.id,
      firstName: values.firstName,
      lastName: values.lastName,
      address: values.address,
      phone: values.phoneNumber,
      startDate: values.startDate,
      terminationDate: values.terminationDate,
      manager: values.manager,
    };

    mutate({ id: selectedPerson.id, body });
  };

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (row) => `${row.firstName} ${row.lastName}`,
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
    {
      key: "terminationDate",
      header: "Termination Date",
      render: (row) => new Date(row.terminationDate).toLocaleDateString(),
    },
    {
      key: "manager",
      header: "Manager",
    },
    {
      key: "actions",
      render: (row) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleEdit(row)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Box>
      <Box display="grid" alignItems="center" mb={3}>
        <Typography variant="h3" textAlign="center">
          Sales Persons
        </Typography>

        <Box />
      </Box>
      {isLoading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <DataTable columns={columns} data={salesPersons} />
      )}

      <Notify
        message={notify.message}
        onClose={() => setNotify({ massage: "", severity: "info" })}
        severity={notify.severity}
      />
      <EditSalesPersonModal
        show={show}
        selectedPerson={selectedPerson}
        handleClose={handleClose}
        handleSave={handleSave}
        updating={isPending}
        error={mutateError?.error ? mutateError?.error.message : ""}
        salesPersons={salesPersons}
      />
    </Box>
  );
};
export default SalesPerson;
