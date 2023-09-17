import { DashboardLayout } from '../components/dashboard-layout';
import { useState } from 'react';
import Head from 'next/head';
import { Box, Container, Typography } from '@mui/material';
import { Col, Input, Pagination, Row, Table } from 'antd';
import { useQuery } from 'react-query';
import torderApi from '../services/torderApi';
import usePrivateRoute from '../hooks/usePrivateRoute';

const ShippingUnits = () => {
  usePrivateRoute();
  const {
    data: shippingUnits = [],
    isLoading: shippingUnitsLoading
  } =
    useQuery(['torderApi.getListShippingUnits'], () => torderApi.getListShippingUnits());
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
      key: 'trackingWebsite',
      title: 'Tracking Website',
      dataIndex: 'trackingWebsite',
      render: (text) => <a href={text} target="_blank" rel="noreferrer">{text}</a>
    },
    {
      key: 'appName',
      title: 'App Name',
      dataIndex: 'appName'
    }
  ];
  const tableData = shippingUnits.map((shippingUnit) => {
    return {
      id: shippingUnit.id,
      name: shippingUnit.name,
      trackingWebsite: shippingUnit.trackingWebsite,
      appName: shippingUnit.appName,
      key: shippingUnit.id
    };
  });
  return (
    <>
      <Head>
        <title>
          Shipping Units | Torder Dashboard
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
            Shipping Units
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

            />
          </div>
        </Container>
      </Box>
    </>
  );
};
ShippingUnits.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);
export default ShippingUnits;
