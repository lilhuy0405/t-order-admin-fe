import Head from 'next/head';
import { Box, Container } from '@mui/material';
import { CustomerListResults } from '../components/customer/customer-list-results';
import { CustomerListToolbar } from '../components/customer/customer-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import { useQuery } from 'react-query';
import torderApi from 'src/services/torderApi';
import { useState } from 'react';
import { Pagination } from 'antd';
import usePrivateRoute from '../hooks/usePrivateRoute';

const Customers = () => {
  usePrivateRoute();
  const [searchParams, setSearchParams] = useState({
    limit: 10,
    page: 0,
    q: '',
    sortBy: 'createdAt',
    sortDirection: 'desc'
  });
  const { data: listOrdersData, refetch } = useQuery(['torderApi.getOrders', searchParams],
    ({ queryKey }) => torderApi.getOrders(queryKey[1]),
    {
      keepPreviousData: true
    });
  const { contents: listOrders = [], totalElements = 0 } = listOrdersData || {};
  console.log(listOrders);

  return (
    <>
      <Head>
        <title>
          Order | Torder Dashboard
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth={false}>
          <CustomerListToolbar setSearchParams={setSearchParams} searchParams={searchParams}/>
          <Box sx={{ mt: 3 }}>
            <CustomerListResults orders={listOrders} reFetchOrders={refetch}/>
          </Box>
          <div style={{ margin: '10px 0', display: 'flex', justifyContent: 'center' }}>
            <Pagination
              current={searchParams.page + 1}
              defaultCurrent={1}
              onChange={(page, limit) => {
                setSearchParams({
                  ...searchParams,
                  page: page - 1,
                  limit: limit
                });
              }}
              total={totalElements}
              pageSize={searchParams.limit}
              showSizeChanger={true}

            />
          </div>
        </Container>
      </Box>
    </>
  );
};
Customers.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Customers;
