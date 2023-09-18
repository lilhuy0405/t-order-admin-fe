import {useEffect, useState} from "react";
import {Button, Form, Input, InputNumber, Modal} from "antd";
import torderApi from "../../services/torderApi";
import toast from "react-hot-toast";
import {LoadingOutlined} from "@ant-design/icons";


const EditProductModal = ({isOpen, setIsOpen, toEdit, refetchProducts}) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const handleCancel = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        form.setFieldsValue({...toEdit});
    }, [toEdit]);

    const handleEditProduct = async (values) => {
        try {
            setIsLoading(true);
            const editProductData = await torderApi.updateProduct(toEdit?.id, values);
            refetchProducts();
            form.resetFields();
            setIsOpen(false);
        } catch (err) {
            throw new Error(err.message);
        } finally {
            setIsLoading(false);
        }

    };

    const submitEditProduct = (values) => {
        toast.promise(handleEditProduct(values), {
            success: () => "Edit Product success!",
            loading: () => "Editing Product...",
            error: (err) => `${err}`,
        })
    }

    return (
        <Modal title="Edit Product"
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
                onFinish={(values) => submitEditProduct(values)}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input product name!'
                        }
                    ]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Price"
                    name="price"
                    rules={[
                        {
                            required: true,
                            message: 'Please input product price!'
                        }
                    ]}
                >
                    <InputNumber min={1}/>
                </Form.Item>

            </Form>
        </Modal>
    );
};

export default EditProductModal;
