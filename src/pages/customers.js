import Head from 'next/head';
import { Box, Container, Typography } from '@mui/material';
import { DashboardLayout } from '../components/dashboard-layout';
import { Col, Input, Pagination, Row, Table } from 'antd';
import { useQuery } from 'react-query';
import torderApi from '../services/torderApi';
import { useState } from 'react';
import usePrivateRoute from '../hooks/usePrivateRoute';

const Customers = () => {
  usePrivateRoute();
  const [dataSearch, setDataSearch] = useState({
    name: '',
    phone: '',
    limit: 10,
    page: 0
  });
  const {
    data: listCustomersData = {},
    isLoading: listCustomersLoading
  } = useQuery(['torderApi.findAllCustomers', dataSearch],
    ({ queryKey }) => torderApi.findAllCustomers(queryKey[1]));
  const { contents: customers = [], totalElements = 0 } = listCustomersData;
  const tableData = customers.map((customer) => {
    return {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      key: customer.id
    };
  });
  const columns = [
    {
      key: 'id',
      title: 'Id',
      dataIndex: 'id'
    },
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name'
    },
    {
      key: 'phone',
      title: 'Phone',
      dataIndex: 'phone'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    }
  ];
  return (
    <>
      <Head>
        <title>
          Customers | Torder Dashboard
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container
          maxWidth={false}
        >
          <Typography variant="h4" sx={{
            marginBottom: 2
          }}>
            Customers
          </Typography>
          <div style={{ marginTop: 20 }}>
            <Row gutter={24}>
              <Col span={8}>
                <Input placeHolder="Search by name"/>
              </Col>
              <Col span={8}>
                <Input placeHolder="Search by phone"/>
              </Col>
            </Row>
          </div>
          <div style={{ marginTop: 20 }}>
            <Table
              columns={columns}
              dataSource={tableData}
              scroll={{ x: 'max-content', y: 500 }}
              pagination={false}
              loading={listCustomersLoading}
            />
          </div>
          <div style={{ margin: '10px 0', display: 'flex', justifyContent: 'center' }}>
            <Pagination
              current={dataSearch.page + 1}
              defaultCurrent={1}
              onChange={(page, limit) => {
                setDataSearch({
                  ...dataSearch,
                  page: page - 1,
                  limit: limit
                });
              }}
              total={totalElements}
              pageSize={dataSearch.limit}
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
