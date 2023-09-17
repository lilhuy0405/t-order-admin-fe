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
import { API_BASE_URL, API_URL } from 'src/constants';
import { Button, Modal, message, notification } from 'antd';
import torderApi from 'src/services/torderApi';

export const CustomerListResults = ({ orders, reFetchOrders, ...rest }) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState(null)
  const minimizeFileName = (fileName) => {
    if (fileName.length < 14) {
      return fileName
    }
    const start = fileName.slice(0, 5)
    const end = fileName.slice(-9)
    return `${start}...${end}`
  }

  const handleDeleteSingle = async () => {
    if (!orderToDelete) return
    try {
      await torderApi.deleteAnOrder(orderToDelete.shipCode, orderToDelete.phoneNumber)
      await reFetchOrders()
      setOpenDeleteModal(false)
      notification.success({
        message: 'Delete success',
        placement: 'bottomRight'
      });
    } catch (err) {
      console.log(err);
      notification.error({
        message: 'Delete failed',
        placement: 'bottomRight'
      })
    }
  }
  const handleDeleteBySource = async () => {
    if (!orderToDelete) return
    try {
      await torderApi.deleteBySource(orderToDelete.sourceFile)
      await reFetchOrders()
      setOpenDeleteModal(false)
      notification.success({
        message: 'Delete success',
        placement: 'bottomRight'
      });
    } catch {
      notification.error({
        message: 'Delete failed',
        placement: 'bottomRight'
      })
    }
  }
  return (
    <>
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
                  Source File
                </TableCell>
                <TableCell>
                  Shipping Unit
                </TableCell>
                <TableCell>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, index) => (
                <TableRow
                  hover
                  key={index}
                >
                  <TableCell>
                    {order?.shipCode}
                  </TableCell>
                  <TableCell>
                    {order?.customerName}
                  </TableCell>
                  <TableCell>
                    {order?.phoneNumber}
                  </TableCell>
                  <TableCell>
                    {order?.product}
                  </TableCell>

                  <TableCell>
                    {order.sourceFile ? (
                      <a href={`${API_BASE_URL}/uploads/${order.sourceFile}`}>
                        {minimizeFileName(order.sourceFile)}
                      </a>
                    ) : (
                      <span>Not updated</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {order.shippingUnit ? order.shippingUnit?.name : 'Not updated'}
                  </TableCell>
                  <TableCell>
                    <Button danger onClick={() => {
                      setOpenDeleteModal(true)
                      setOrderToDelete(order)
                    }}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Card>
      <Modal
        title="Delete Order"
        open={openDeleteModal}
        onCancel={() => setOpenDeleteModal(false)}
        onOk={() => setOpenDeleteModal(false)}
        footer={[
          <Button danger key='delete-single' onClick={handleDeleteSingle}>Delete</Button>,
          orderToDelete && orderToDelete.sourceFile &&
          <Button danger key='delete-multiple' onClick={handleDeleteBySource}>Delete: {minimizeFileName(orderToDelete.sourceFile)}</Button>,

          <Button key="back" onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
        ]}
      >
        <p>Are you sure you want to delete this order? This action can not be undo</p>
      </Modal>
    </>
  );
};


