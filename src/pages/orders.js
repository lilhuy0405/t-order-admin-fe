import Head from 'next/head';
import { Box, Container } from '@mui/material';
import { CustomerListResults } from '../components/customer/customer-list-results';
import { CustomerListToolbar } from '../components/customer/customer-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import { useQuery } from 'react-query';
import torderApi from 'src/services/torderApi';
import { useState } from 'react';
import { Pagination } from 'antd';

const Customers = () => {
  const [searchParams, setSearchParams] = useState({
    limit: 10,
    page: 1,
    q: ''
  });
  const { data: listOrders = { orders: [], currentPage: 1, totalPages: 1 }, refetch } = useQuery(['torderApi.getOrders', searchParams], ({ queryKey }) => torderApi.getOrders(queryKey[1]), {
    keepPreviousData: true,
  })
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
          <CustomerListToolbar setSearchParams={setSearchParams} />
          <Box sx={{ mt: 3 }}>
            <CustomerListResults orders={listOrders} reFetchOrders={refetch} />
          </Box>
          <div style={{ margin: '10px 0', display: 'flex', justifyContent: "center" }}>
            <Pagination
              current={searchParams.page}
              defaultCurrent={1}
              onChange={(page) => {
                setSearchParams({
                  ...searchParams,
                  page: page,
                })
              }}
              total={listOrders.totalPages * 10}
              pageSize={10}
              defaultPageSize={10}
              showSizeChanger={false}

            />
          </div>
        </Container>
      </Box>
    </>
  );
}
Customers.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Customers;
