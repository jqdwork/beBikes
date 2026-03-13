import { useState, useEffect } from "react";
import productsApi from "../api/productsApi";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import DataTable from "../components/DataTable";
import EditProductModal from "../components/EditProductModal";
import Notify from "../components/Notify";

const Product = () => {
  const [show, setShow] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notify, setNotify] = useState("");

  const queryClient = useQueryClient();
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryFn: productsApi.getProducts,
    queryKey: ["products"],
  });
  const {
    mutate,
    error: mutateError,
    reset,
    isPending,
  } = useMutation({
    mutationFn: ({ id, body }) => productsApi.updateProduct(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setNotify({
        message: "Product updated successfully",
        severity: "success",
      });
      setSelectedProduct(null);
      setShow(false);
    },
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

  const handleEdit = (row) => {
    setSelectedProduct(row);
    setShow(true);
  };

  const handleClose = () => {
    reset();
    setSelectedProduct(null);
    setShow(false);
  };

  const handleSave = (values) => {
    if (!selectedProduct) return;

    const body = {
      ...values,
      id: selectedProduct.id,
      name: values.name,
      manufacturer: values.manufacturer,
      style: values.style,
      purchasePrice: Number(values.purchasePrice),
      salePrice: Number(values.salePrice),
      qtyOnHand: Number(values.qtyOnHand),
      commissionPercentage: Number(values.commissionPercentage),
    };

    mutate({ id: selectedProduct.id, body });
  };

  const columns = [
    {
      key: "name",
      header: "Name",
    },
    {
      key: "manufacturer",
      header: "Manufacturer",
    },
    {
      key: "style",
      header: "Style",
    },
    {
      key: "purchasePrice",
      header: "Purchase Price",
      render: (row) => `$${Number(row.purchasePrice ?? 0).toFixed(2)}`,
    },
    {
      key: "salePrice",
      header: "Sale Price",
      render: (row) => `$${Number(row.salePrice ?? 0).toFixed(2)}`,
    },
    {
      key: "qtyOnHand",
      header: "Quantity On Hand",
    },
    {
      key: "commissionPercentage",
      header: "Commission %",
      render: (row) => `${row.commissionPercentage}%`,
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
          Products
        </Typography>

        <Box />
      </Box>
      {isLoading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <DataTable columns={columns} data={products} />
      )}
      <Notify
        message={notify.message}
        onClose={() => setNotify({ message: "", severity: "info" })}
        severity={notify.severity}
      />
      <EditProductModal
        show={show}
        handleClose={handleClose}
        handleSave={handleSave}
        selectedProduct={selectedProduct}
        updating={isPending}
        error={mutateError?.error ? mutateError?.error.message : ""}
        products={products}
      />
    </Box>
  );
};
export default Product;
