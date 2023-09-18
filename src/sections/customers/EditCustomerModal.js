import {Button, Form, Input, InputNumber, Modal} from "antd";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {LoadingOutlined} from "@ant-design/icons";
import torderApi from "../../services/torderApi";

const EditCustomerModal = ({isOpen, setIsOpen, toEdit, refetchCustomers}) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const handleCancel = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        form.setFieldsValue({...toEdit});
    }, [toEdit]);

    const handleEditCustomer = async (values) => {
        try {
            setIsLoading(true);
            const editCustomerData = await torderApi.updateCustomer(toEdit?.id, values);
            refetchCustomers();
            form.resetFields();
            setIsOpen(false);
        } catch (err) {
            throw new Error(err.message);
        } finally {
            setIsLoading(false);
        }

    };

    const submitEditCustomer = (values) => {
        toast.promise(handleEditCustomer(values), {
            success: () => "Edit Customer success!",
            loading: () => "Editing Customer...",
            error: (err) => `${err}`,
        })
    }

    return (
        <Modal title="Edit Customer"
               width={600}
               open={isOpen}
               onOk={() => form.submit()}
               okText={isLoading ? "Submitting" : "Submit"}
               onCancel={() => handleCancel()}
               footer={[
                   <Button key='submit'
                           type='primary'
                           disabled={isLoading}
                           icon={isLoading && <LoadingOutlined
                               spin
                           />}
                           onClick={() => form.submit()}>{isLoading ? "Submitting" : "Submit"}
                   </Button>,
                   <Button
                       key='cancel'
                       onClick={() => handleCancel()}
                   >Cancel
                   </Button>,
               ]}
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={(values) => submitEditCustomer(values)}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input customer name!'
                        }
                    ]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: 'Please input customer phone number!'
                        }
                    ]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Address"
                    name="address"
                >
                    <Input/>
                </Form.Item>

            </Form>
        </Modal>
    );
};

export default EditCustomerModal;
