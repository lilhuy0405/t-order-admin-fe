import axiosClient from './axiosClient';

const torderApi = {
    login: async (data = {}) => {
        console.log(data);
        const res = await axiosClient.post('/login', data);
        return res;
    },
    uploadOrder: async (data = {}) => {
        const res = await axiosClient.post('/upload-orders', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res;
    },
    getOrders: async (q) => {
        const res = await axiosClient.get('/orders', { params: { q } });
        return res;
    },
    getLastestOrders: async () => {
        const res = await axiosClient.get('/latest-orders');
        return res;
    },

}

export default torderApi