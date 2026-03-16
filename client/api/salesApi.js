import { service } from "./service";

const salesApi = {
  getSales: async () => service.get("api/sales"),
  createSale: async (body) => service.post("api/sales", body),
  deleteSale: async (id) => service.delete(`/api/sales/${id}`),
};
export default salesApi;
