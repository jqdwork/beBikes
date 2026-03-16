import { service } from "./service";

const productsApi = {
  getProducts: async () => service.get("/api/products"),
  updateProduct: async (id, body) => service.put(`/api/products/${id}`, body),
  createProduct: async (body) => service.post(`/api/product`, body),
};

export default productsApi;
