import { service } from "./service";

const customersApi = {
  getCustomers: async () => service.get("/api/customers"),
  createCustomer: async (body) => service.post("/api/customers", body),
  deleteCustomer: async (id) => service.delete(`/api/customers/${id}`),
};
export default customersApi;
