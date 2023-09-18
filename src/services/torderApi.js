import queryString from 'query-string';
import axiosClient from './axiosClient';

const torderApi = {
  login: async (data = {}) => {
    console.log(data);
    const res = await axiosClient.post('/auth/login', data);
    return res;
  },
  uploadOrder: async (data = {}) => {
    const res = await axiosClient.post('/orders/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res;
  },
  getOrders: async (params = {}) => {
    console.log(params);
    const res = await axiosClient.get(`/orders`, { params });
    return res;
  },
  getLastestOrders: async () => {
    const res = await axiosClient.get('/orders', {
      params: {
        limit: 5,
        page: 0,
        sortBy: 'createdAt',
        sortDirection: 'DESC'
      }
    });
    return res;
  },

  countAllOrders: async () => {
    const res = await axiosClient.get('/orders/count');
    return res;
  },

  deleteBySource: async (source) => {
    const res = await axiosClient.delete(`/orders/by-source`, {
      data: {
        sourceFile: source
      }
    });
    return res;
  },

  deleteAnOrder: async (shipCode, phoneNumber) => {
    const res = await axiosClient.delete(`/orders/${phoneNumber}/${shipCode}`);
  },
  getListShippingUnits: async () => {
    const res = await axiosClient.get('/shipping-units');
    return res;
  },

  createShippingUnit: async (data = {}) => {
    const res = await axiosClient.post('/shipping-units', data);
    return res;
  },
  updateShippingUnit: async (id, data = {}) => {
    const res = await axiosClient.put('/shipping-units/' + id, data);
    return res;
  },
  deleteShippingUnit: async (id) => {
    const res = await axiosClient.delete('/shipping-units/' + id);
    return res;
  },
  findAllCustomers: async (params = {}) => {
    const res = await axiosClient.get('/customers', { params });
    return res;
  },
  updateCustomer: async (id, data) => {
    const res = await axiosClient.put('/customers/' + id, data);
    return res;
  },
  getCustomerOrdersById: async (id) => {
    const res = await axiosClient.get('/customers/'+ id + '/orders');
    return res;
  },
  findAllProducts: async (params = {}) => {
    const res = await axiosClient.get('/products', { params });
    return res;
  },
  updateProduct: async (id, data) => {
    const res = await axiosClient.put('/products/' + id, data);
    return res;
  },
  dashBoardReport: async (params = {}) => {
    const res = await axiosClient.get('/dashboard', { params });
    return res;
  }

};

export default torderApi;
