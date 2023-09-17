import Head from 'next/head';
import { Box, Container, Grid, Typography } from '@mui/material';
import { DashboardLayout } from '../components/dashboard-layout';
import { Col, Input, Row, Table, Pagination } from 'antd';
import { useState } from 'react';
import { useQuery } from 'react-query';
import torderApi from '../services/torderApi';
import usePrivateRoute from '../hooks/usePrivateRoute';

const Products = () => {
  usePrivateRoute();
  const [dataSearch, setDataSearch] = useState({
    name: '',
    limit: 10,
    page: 0
  });
  const {
    data: listProductsData = {},
    isLoading: listProductsLoading
  } = useQuery(['torderApi.findAllProducts', dataSearch],
    ({ queryKey }) => torderApi.findAllProducts(queryKey[1]));
  const { contents: products = [], totalElements = 0 } = listProductsData;
  const tableData = products.map((product) => {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      key: product.id
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
      key: 'price',
      title: 'Price',
      dataIndex: 'price'
    }
  ];
  return (
    <>
      <Head>
        <title>
          Products | Torder Dashboard
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
            Products
          </Typography>
          <div style={{ marginTop: 20 }}>
            <Row gutter={24}>
              <Col span={8}>
                <Input placeHolder="Search by name"/>
              </Col>
            </Row>
          </div>
          <div style={{ marginTop: 20 }}>
            <Table
              columns={columns}
              dataSource={tableData}
              scroll={{ x: 'max-content', y: 500 }}
              pagination={false}
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

Products.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Products;
