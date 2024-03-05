export const TORDER_PROFILE = 'TORDER_PROFILE';
export const API_URL = 'https://torder-be.lilhuy-server.uk/api/v1';

export const API_BASE_URL = 'https://torder-be.lilhuy-server.uk/';

// export const API_URL = 'http://localhost:8080/api/v1';

export const ORDER_FIELDS = [
    {
        name: 'customerName',
        label: 'Customer Name',
        required: true
    },
    {
        name: 'phone',
        label: 'Phone Number',
        required: true
    },
    {
        name: 'product',
        label: 'Product',
        required: true
    },
    {
        name: 'shipCode',
        label: 'Ship Code',
        required: true
    },
    {
        name: 'amount',
        label: 'Amount',
        required: false
    },
    {
        name: 'shipAddress',
        label: 'Ship Address',
        required: false
    }
];
