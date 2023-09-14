import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip
} from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { SeverityPill } from '../severity-pill';
import { useQuery } from 'react-query';
import torderApi from 'src/services/torderApi';
import moment from 'moment';
import { useRouter } from 'next/router';

export const LatestOrders = (props) => {
  const { data: latestOrderData = {}, isLoading: isLoadingOrders, isError: isErrorOrder } = useQuery(
    'torderApi.getLastestOrders',
    () => torderApi.getLastestOrders());
  const {contents: latestOrders = []} = latestOrderData;
  const router = useRouter();
  return (
    <Card {...props}>
      <CardHeader title="Latest Orders"/>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Ship Code
                </TableCell>
                <TableCell>
                  Customer
                </TableCell>
                <TableCell sortDirection="desc">
                  Phone Number
                </TableCell>
                <TableCell>
                  Product
                </TableCell>
                <TableCell>
                  Created at
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {latestOrders.map((order, index) => (
                <TableRow
                  hover
                  key={index}
                >
                  <TableCell>
                    {order.shipCode}
                  </TableCell>
                  <TableCell>
                    {order.customerName}
                  </TableCell>
                  <TableCell>
                    {order.phoneNumber}
                  </TableCell>
                  <TableCell>
                    {order.product}
                  </TableCell>
                  <TableCell>
                    {moment(order.createdAt).format('DD/MM/YYYY')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2
        }}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon fontSize="small"/>}
          size="small"
          variant="text"
          onClick={() => {
            router.push('/orders');
          }}
        >
          View all
        </Button>
      </Box>
    </Card>
  );
};
