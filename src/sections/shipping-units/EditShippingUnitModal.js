import {Button, Form, Input, Modal} from 'antd';
import {useEffect, useState} from 'react';
import torderApi from '../../services/torderApi';
import toast from 'react-hot-toast';
import {LoadingOutlined} from '@ant-design/icons';

const EditShippingUnitModal = ({isOpen, setIsOpen, toEdit, refetchShippingUnit}) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const handleCancel = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        form.setFieldsValue({...toEdit});
    }, [toEdit]);

    const handleEditShippingUnit = async (values) => {
        try {
          setIsLoading(true);
          const editShippingUnitData = await torderApi.updateShippingUnit(toEdit?.id, values);
          refetchShippingUnit();
          form.resetFields();
          setIsOpen(false);
        } catch (err) {
          throw new Error(err.message);
        } finally {
          setIsLoading(false);
        }

    };

    const submitEditShippingUnit = (values) => {
        toast.promise(handleEditShippingUnit(values), {
            success: () => "Edit Shipping Unit success!",
            loading: () => "Editing Shipping Unit...",
            error: (err) => `${err}`,
        })
    }

    return (
        <Modal title="Basic Modal"
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
                onFinish={(values) => submitEditShippingUnit(values)}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input shipping unit name!'
                        }
                    ]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Tracking Website"
                    name="trackingWebsite"
                    rules={[
                        {
                            required: true,
                            message: 'Please input tracking website!'
                        }
                    ]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="App Name"
                    name="appName"
                    rules={[
                        {
                            required: true,
                            message: 'Please input App Name!'
                        }
                    ]}
                >
                    <Input/>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditShippingUnitModal;
