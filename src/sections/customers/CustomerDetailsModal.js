import {Button, Modal, Table} from "antd";
import {useState} from "react";
import torderApi from "../../services/torderApi";
import Title from "antd/lib/typography/Title";
import {Stack} from "@mui/material";
import {AiOutlineEdit} from "react-icons/ai";
import {BiSolidShow} from "react-icons/bi";
import {useQuery} from "react-query";

const CustomerDetailsModal = ({isOpen, setIsOpen, toShow}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleCancel = () => {
        setIsOpen(false);
    };

    const {data: customerOrdersData = []} = useQuery({
        queryKey: ["torderApi.getCustomerOrdersById", toShow],
        queryFn: ({queryKey}) => torderApi.getCustomerOrdersById(queryKey[1]?.id),
        enabled: !!toShow?.id
    })



    const tableData = customerOrdersData.map((order) => {
        return {
            shipCode: order?.shipCode,
            product: order?.product,
            amount: order?.amount,
            shipAddress: order?.shipAddress,
        };
    });

    const columns = [
        {
            key: 'shipCode',
            title: 'Ship Code',
            dataIndex: 'shipCode'
        },
        {
            key: 'product',
            title: 'Product',
            dataIndex: 'product'
        },
        {
            key: 'amount',
            title: 'Amount',
            dataIndex: 'amount'
        },
        {
            title: 'Ship Address',
            dataIndex: 'shipAddress',
            key: 'shipAddress'
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt'
        },
    ];


    return (
        <Modal title="Customer Details"
               width={1000}
               open={isOpen}
               onOk={() => form.submit()}
               okText={isLoading ? "Submitting" : "Submit"}
               onCancel={() => handleCancel()}
               footer={[]}
        >
            {
                <>
                    <p><b>Customer Name:</b> {toShow?.name}</p>
                    <p><b>Customer Phone:</b> {toShow?.phone}</p>
                    <p><b>Customer Address:</b> {toShow?.address ?? 'Address is not found...'}</p>
                    <Title level={4}
                           style={{textAlign: 'center'}}>
                        Customer Orders Table
                    </Title>
                    <Table
                        columns={columns}
                        dataSource={tableData}
                        scroll={{x: 'max-content', y: 500}}
                        pagination={false}
                    />
                </>

            }

        </Modal>
    );
};

export default CustomerDetailsModal;
