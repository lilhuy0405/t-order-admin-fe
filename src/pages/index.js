import Head from 'next/head';
import { Box, Container, Grid, Typography } from '@mui/material';
import { Budget } from '../components/dashboard/budget';
import { LatestOrders } from '../components/dashboard/latest-orders';
import { TasksProgress } from '../components/dashboard/tasks-progress';
import { TotalCustomers } from '../components/dashboard/total-customers';
import { TotalProfit } from '../components/dashboard/total-profit';
import { UploadOrders } from '../components/dashboard/UploadOrders';
import { DashboardLayout } from '../components/dashboard-layout';
import usePrivateRoute from 'src/hooks/usePrivateRoute';
import { useQuery } from 'react-query';
import torderApi from '../services/torderApi';
import PeopleIcon from '@mui/icons-material/PeopleOutlined';
import { BsFillCartCheckFill, BsFillKeyboardFill } from 'react-icons/bs';
import { CiMoneyBill } from 'react-icons/ci';
import { LatestProducts } from '../components/dashboard/latest-products';

const Dashboard = () => {
  usePrivateRoute();
  const {
    data: dashBoardReportData = {}
  } = useQuery(['torderApi.dashBoardReport'], () => torderApi.dashBoardReport());
  const {
    totalCustomers = 0,
    totalOrders = 0,
    totalProducts = 0,
    totalRevenue = 0
  } = dashBoardReportData;

  return (
    <>
      <Head>
        <title>
          Dashboard | T-order
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
          <Typography variant='h4' sx={{marginBottom: 5}}>Dashboard</Typography>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <TotalCustomers
                amount={totalOrders}
                title="TOTAL ORDERS"
                icon={<BsFillCartCheckFill/>}

              />
            </Grid>
            <Grid
              item
              xl={3}
              lg={3}
              sm={6}
              xs={12}
            >
              <TotalCustomers
                amount={totalCustomers}
                title="TOTAL CUSTOMERS"
                icon={<PeopleIcon/>}

              />
            </Grid>
            <Grid
              item
              xl={3}
              lg={3}
              sm={6}
              xs={12}
            >
              <TotalCustomers
                amount={totalProducts}
                title="TOTAL PRODUCTS"
                icon={<BsFillKeyboardFill/>}
              />
            </Grid>
            <Grid
              item
              xl={3}
              lg={3}
              sm={6}
              xs={12}
            >
              <TotalCustomers
                amount={totalRevenue}
                title="TOTAL AMOUNT"
                icon={<CiMoneyBill/>}
              />
            </Grid>


            <Grid
              item
              lg={12}
              md={12}
              xl={12}
              xs={12}
            >
              <LatestOrders/>
            </Grid>

          </Grid>
        </Container>
      </Box>
    </>
  );
};

Dashboard.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Dashboard;
