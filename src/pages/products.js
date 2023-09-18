import Head from 'next/head';
import {Box, Container, Grid, Stack, Typography} from '@mui/material';
import {DashboardLayout} from '../components/dashboard-layout';
import {Col, Input, Row, Table, Pagination, Button, Popconfirm} from 'antd';
import {useCallback, useState} from 'react';
import {useQuery} from 'react-query';
import torderApi from '../services/torderApi';
import usePrivateRoute from '../hooks/usePrivateRoute';
import {AiOutlineEdit} from "react-icons/ai";
import {BsFillTrashFill} from "react-icons/bs";
import EditProductModal from "../sections/products/EditProductModal";
import {formatPrice} from "../utils";
import _debounce from "lodash/debounce";

const Products = () => {
    const [isOpenEditProduct, setIsOpenEditProduct] = useState(false);
    const [toEdit, setToEdit] = useState(null);


    usePrivateRoute();
    const [dataSearch, setDataSearch] = useState({
        name: '',
        limit: 10,
        page: 0
    });
    const {
        data: listProductsData = {},
        isLoading: listProductsLoading,
        refetch: refetchProducts
    } = useQuery(['torderApi.findAllProducts', dataSearch],
        ({queryKey}) => torderApi.findAllProducts(queryKey[1]));
    const {contents: products = [], totalElements = 0} = listProductsData;
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
            dataIndex: 'price',
            sorter: true,
            sortDirections: ['ascend', 'descend'],
            render: (price) => {
                return (
                    <div>{formatPrice(price)}</div>
                )
            }
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (text, record) => (
                <Stack direction="row" spacing={1}>
                    <Button onClick={() => {
                        setToEdit(record);
                        setIsOpenEditProduct(true);
                    }}>
                        <AiOutlineEdit/>
                    </Button>
                </Stack>
            )
        }
    ];

    const handeSearchDebounce = (value) => {
        setDataSearch({
            ...dataSearch,
            name: value
        });
    };

    const debounceFn = useCallback(_debounce(handeSearchDebounce, 500), [dataSearch]);

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
                    <div style={{marginTop: 20}}>
                        <Row gutter={24}>
                            <Col span={8}>
                                <Input placeHolder="Search by name"
                                       onChange={(e) => debounceFn(e.target.value)}/>
                            </Col>
                        </Row>
                    </div>
                    <div style={{marginTop: 20}}>
                        <Table
                            columns={columns}
                            dataSource={tableData}
                            scroll={{x: 'max-content', y: 500}}
                            pagination={false}
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
            <EditProductModal
                isOpen={isOpenEditProduct}
                setIsOpen={setIsOpenEditProduct}
                toEdit={toEdit}
                refetchProducts={refetchProducts}
            />
        </>
    );

};

Products.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Products
