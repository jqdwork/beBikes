import { service } from "./service";

const salesPersonApi = {
  getSalesPersons: async () => service.get("/api/salesPersons"),
  updateSalesPerson: async (id, body) =>
    service.put(`/api/salesPersons/${id}`, body),
  createSalesPerson: async (body) => service.post("/api/salesPersons", body),
  deleteSalesPerson: async (id) => service.delete(`/api/salesPerson${id}`),
};
export default salesPersonApi;
