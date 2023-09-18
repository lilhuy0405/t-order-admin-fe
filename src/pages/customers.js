import Head from 'next/head';
import {Box, Container, Stack, Typography} from '@mui/material';
import {DashboardLayout} from '../components/dashboard-layout';
import {Button, Col, Input, Pagination, Popconfirm, Row, Table} from 'antd';
import {useQuery} from 'react-query';
import torderApi from '../services/torderApi';
import {useCallback, useState} from 'react';
import usePrivateRoute from '../hooks/usePrivateRoute';
import {AiOutlineEdit} from "react-icons/ai";
import {BsFillTrashFill} from "react-icons/bs";
import EditCustomerModal from "../sections/customers/EditCustomerModal";
import _debounce from "lodash/debounce";
import CustomerDetailsModal from "../sections/customers/CustomerDetailsModal";
import {BiSolidShow} from "react-icons/bi";

const Customers = () => {
    const [isOpenEditCustomer, setIsOpenEditCustomer] = useState(false);
    const [isOpenShowCustomer, setIsOpenShowCustomer] = useState(false);
    const [toEdit, setToEdit] = useState(null);
    const [toShow, setToShow] = useState(null);

    usePrivateRoute();
    const [dataSearch, setDataSearch] = useState({
        name: '',
        phone: '',
        limit: 10,
        page: 0
    });
    const {
        data: listCustomersData = {},
        isLoading: listCustomersLoading,
        refetch: refetchCustomers
    } = useQuery(['torderApi.findAllCustomers', dataSearch],
        ({queryKey}) => torderApi.findAllCustomers(queryKey[1]));
    const {contents: customers = [], totalElements = 0} = listCustomersData;
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
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (text, record) => (
                <Stack direction="row" spacing={1}>
                    <Button onClick={() => {
                        setToEdit(record);
                        setIsOpenEditCustomer(true);
                    }}>
                        <AiOutlineEdit/>
                    </Button>
                    <Button onClick={() => {
                        setToShow(record);
                        setIsOpenShowCustomer(true);
                    }}>
                        <BiSolidShow/>
                    </Button>

                </Stack>
            )
        }
    ];

    const handeSearchByNameDebounce = (value) => {
        setDataSearch({
            ...dataSearch,
            name: value
        });
    };

    const handeSearchByPhoneDebounce = (value) => {
        setDataSearch({
            ...dataSearch,
            phone: value
        });
    };

    const debounceSearchByName = useCallback(_debounce(handeSearchByNameDebounce, 500), [dataSearch]);
    const debounceSearchByPhone = useCallback(_debounce(handeSearchByPhoneDebounce, 500), [dataSearch]);

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
                    <div style={{marginTop: 20}}>
                        <Row gutter={24}>
                            <Col span={8}>
                                <Input placeHolder="Search by name"
                                       onChange={(e) => debounceSearchByName(e.target.value)}
                                />
                            </Col>
                            <Col span={8}>
                                <Input placeHolder="Search by phone"
                                       onChange={(e) => debounceSearchByPhone(e.target.value)}
                                />
                            </Col>
                        </Row>
                    </div>
                    <div style={{marginTop: 20}}>
                        <Table
                            columns={columns}
                            dataSource={tableData}
                            scroll={{x: 'max-content', y: 500}}
                            pagination={false}
                            loading={listCustomersLoading}
                        />
                    </div>
                    <div style={{margin: '10px 0', display: 'flex', justifyContent: 'center'}}>
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
            <EditCustomerModal
                isOpen={isOpenEditCustomer}
                setIsOpen={setIsOpenEditCustomer}
                toEdit={toEdit}
                refetchCustomers={refetchCustomers}
            />
            <CustomerDetailsModal
                isOpen={isOpenShowCustomer}
                setIsOpen={setIsOpenShowCustomer}
                toShow={toShow}
            />
        </>
    );
};
Customers.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);
export default Customers;
