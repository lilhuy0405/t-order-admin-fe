import { Box, Card, CardContent, CardHeader, Divider, Typography, useTheme } from '@mui/material';
import { Form, Upload, Button, Table, Row, Col, Input, Select, InputNumber, notification } from 'antd';
import { fi } from 'date-fns/locale';
import { useState } from 'react';
import { OutTable, ExcelRenderer } from 'react-excel-renderer';
import torderApi from 'src/services/torderApi';

const ALLOWED_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel'

]
const alphabets = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  'AA',
  'AB',
]
export const UploadOrders = (props) => {
  const theme = useTheme();
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState([]);
  const [loading, setLoading] = useState(false);
  const [configAlphabet, setConfigAlphabet] = useState([]);
  const [form] = Form.useForm();
  const handleChooseFile = ({ file }) => {
    ExcelRenderer(file, (err, resp) => {
      if (err) {
        console.log(err);
      }
      else {
        // normilize data for atd table
        const cols = resp.cols.map((col) => {
          return {
            title: col.name,
            dataIndex: col.key,
            key: col.key,
          }
        });
        const configColNames = alphabets.slice(0, resp.cols.length);
        const antdTableColumns = [
          {
            title: '',
            dataIndex: 'counter',
            key: 'counter',
          },
          ...cols,
        ]

        const antdTableData = resp.rows.map((row, index) => {
          return {
            key: row[0],
            counter: index + 1,
            ...row
          }
        });

        setCols(antdTableColumns);
        setRows(antdTableData);
        setConfigAlphabet(configColNames);
      }
    });
    setFile(file);
  }

  const handleFinish = async (values) => {
    try {
      setLoading(true);

      if (!file) {
        throw new Error('Please choose file');
      }
      const formData = new FormData();
      console.log(file);
      formData.append('file', file);
      formData.append('shipCodeColumn', values.shipCodeColumn);
      formData.append('phoneColumn', values.phoneColumn);
      formData.append('productColumn', values.productColumn);
      formData.append('customerNameColumn', values.customerNameColumn);
      formData.append('dataStartRow', values.dataStartRow);
      const res = await torderApi.uploadOrder(formData);
      console.log(res);

      notification.success({
        message: 'Upload success added ' + res.length + ' orders',
        placement: 'bottomRight'
      });
      form.resetFields();
      setFile(null);

    } catch (error) {
      console.log(error);
      notification.error({
        message: error.message,
        placement: 'bottomRight'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card {...props}>
      <CardHeader
        title="Upload Orders file"
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            position: 'relative'
          }}
        >

          <Form
            name='upload-orders'
            layout='vertical'
            onFinish={handleFinish}
            form={form}

          >
            <Upload.Dragger
              accept={ALLOWED_TYPES.join(', ')}
              showUploadList={false}
              customRequest={handleChooseFile}
              className='mb-24'
              height={160}
            >

              <div className='flex-row justify-content-center'>

                <Box sx={{ my: 2 }}>
                  Drag order excel file here.
                </Box>
                <Button>
                  Choose File
                </Button>

              </div>
            </Upload.Dragger>

            {
              file && (
                <>
                  <Box sx={{ my: 2 }}>
                    <Typography variant='h6'>Preview: {file.name}</Typography>
                  </Box>
                  <Table
                    columns={cols}
                    dataSource={rows}
                    bordered
                    scroll={{ x: 'max-content' }}
                    pagination={{ pageSize: 5 }}
                  />

                  <Divider />
                  <Box sx={{ mx: 2 }}>
                    <Typography variant='h6'>Data configs</Typography>
                    <Row gutter={24}>
                      <Col span={6}>
                        <Form.Item
                          label='Shipcode column'
                          name='shipCodeColumn'
                          rules={[
                            { required: true, message: 'Please select shipcode column' }
                          ]}

                        >
                          <Select>
                            {
                              configAlphabet.map((alphabet) => (
                                <Select.Option value={alphabet} key={alphabet}>{alphabet}</Select.Option>
                              ))
                            }
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={6}>
                        <Form.Item
                          label='Phone column'
                          name='phoneColumn'
                          rules={[
                            { required: true, message: 'Please select phone column' }
                          ]}
                        >
                          <Select>
                            {
                              configAlphabet.map((alphabet) => (
                                <Select.Option value={alphabet} key={alphabet}>{alphabet}</Select.Option>
                              ))
                            }
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={6}>
                        <Form.Item
                          label='Product column'
                          name='productColumn'
                          rules={[
                            { required: true, message: 'Please select product column' }
                          ]}
                        >
                          <Select>
                            {
                              configAlphabet.map((alphabet) => (
                                <Select.Option value={alphabet} key={alphabet}>{alphabet}</Select.Option>
                              ))
                            }
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={6}>
                        <Form.Item
                          label='Customer name column'
                          name='customerNameColumn'
                        >
                          <Select>
                            {
                              configAlphabet.map((alphabet) => (
                                <Select.Option value={alphabet} key={alphabet}>{alphabet}</Select.Option>
                              ))
                            }
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={6}>
                        <Form.Item
                          label='Data start row'
                          name='dataStartRow'
                          rules={[
                            { required: true, message: 'Please select data start row' }
                          ]}
                        >
                          <InputNumber min={1} step={1} max={rows.length} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Box>
                </>

              )
            }

            <div>
              <Button style={{ width: '100%', margin: '20px' }} type='primary' htmlType='submit' disabled={loading}>
                {

                  loading ? 'Processing...' : 'Upload'
                }
              </Button>
            </div>
          </Form>

        </Box>
      </CardContent>
    </Card >
  );
};
