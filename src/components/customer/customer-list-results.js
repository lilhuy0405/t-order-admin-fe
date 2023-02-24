import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {

  Box,
  Card,

  Table,
  TableBody,
  TableCell,
  TableHead,

  TableRow,

} from '@mui/material';
import { getInitials } from '../../utils/get-initials';
import moment from 'moment';

export const CustomerListResults = ({ orders, ...rest }) => {


  return (
    <Card {...rest}>
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
            {orders.orders.map((order, index) => (
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
    </Card>
  );
};

CustomerListResults.propTypes = {
  customers: PropTypes.array.isRequired
};
