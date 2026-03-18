import { service } from "./service";

const salesApi = {
  getSales: async (from, to) => {
    return service.post("/api/sales/filter", { from, to });
  },
  createSale: async (body) => service.post("/api/sales", body),
  deleteSale: async (id) => service.delete(`/api/sales/${id}`),
};
export default salesApi;
