import {DashboardLayout} from '../components/dashboard-layout';
import {useState} from 'react';
import Head from 'next/head';
import {Box, Container, Stack, Typography} from '@mui/material';
import {Button, Col, Input, Pagination, Popconfirm, Row, Table} from 'antd';
import {useQuery} from 'react-query';
import torderApi from '../services/torderApi';
import usePrivateRoute from '../hooks/usePrivateRoute';
import AddShippingUnitModal from '../sections/shipping-units/AddShippingUnitModal';
import {AiOutlineEdit} from 'react-icons/ai';
import {BsFillTrashFill} from 'react-icons/bs';
import EditShippingUnitModal from "../sections/shipping-units/EditShippingUnitModal";
import toast from "react-hot-toast";

const ShippingUnits = () => {
    const [isOpenAddShippingUnit, setIsOpenAddShippingUnit] = useState(false);
    const [isOpenEditShippingUnit, setIsOpenEditShippingUnit] = useState(false);
    const [toEdit, setToEdit] = useState(null);

    const onDeleteShippingUnit = async (id) => {
        try {
          const deleteData = await torderApi.deleteShippingUnit(id);
          await refetchShippingUnit();
        } catch (e) {
          throw new Error(e.message);
        }
    }

    const confirmDeleteShippingUnit = async (id) => {
        toast.promise(onDeleteShippingUnit(id), {
            success: () => "Deleted Shipping Unit successfully",
            loading: () => "Deleting Shipping Unit...",
            error: (err) => `${err}`
        })
    }

    usePrivateRoute();
    const {
        data: shippingUnits = [],
        isLoading: shippingUnitsLoading,
        refetch: refetchShippingUnit
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
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (text, record) => (
                <Stack direction="row" spacing={1}>
                    <Button onClick={() => {
                        setToEdit(record);
                        setIsOpenEditShippingUnit(true);
                    }}>
                        <AiOutlineEdit/>
                    </Button>
                    <Popconfirm
                        title="Delete Shipping Unit"
                        description="Are you sure to delete this Shipping Unit?"
                        onConfirm={async () => {
                            await confirmDeleteShippingUnit(record?.id);
                        }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger>
                            <BsFillTrashFill/>
                        </Button>
                    </Popconfirm>

                </Stack>
            )
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
                    <div style={{marginTop: 20}}>
                        <Row gutter={24}>
                            <Col span={8}>
                                <Input placeHolder="Search by name"/>
                            </Col>
                            <Col span={16}>
                                <Button type={'primary'} style={{float: "right"}}
                                        onClick={() => setIsOpenAddShippingUnit(true)}>Add Shipping Unit</Button>
                            </Col>
                        </Row>
                    </div>
                    <div style={{marginTop: 20}}>
                        <Table
                            columns={columns}
                            dataSource={tableData}
                            scroll={{x: 'max-content', y: 500}}

                        />
                    </div>
                </Container>
            </Box>
            <AddShippingUnitModal
                isOpen={isOpenAddShippingUnit}
                setIsOpen={setIsOpenAddShippingUnit}
                refetchShippingUnit={refetchShippingUnit}
            />
            <EditShippingUnitModal
            isOpen={isOpenEditShippingUnit}
            setIsOpen={setIsOpenEditShippingUnit}
            toEdit={toEdit}
            refetchShippingUnit={refetchShippingUnit}
            />
        </>
    );
};
ShippingUnits.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);
export default ShippingUnits;
