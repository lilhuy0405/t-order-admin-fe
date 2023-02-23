import { Box, Card, CardContent, CardHeader, Divider, Typography, useTheme } from '@mui/material';
import { Form, Upload, Button, Table, Row, Col, Input, Select, InputNumber } from 'antd';
import { fi } from 'date-fns/locale';
import { useState } from 'react';
import { OutTable, ExcelRenderer } from 'react-excel-renderer';

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
  const [configAlphabet, setConfigAlphabet] = useState([]);
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

          <Form>
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
                        >
                          <Select>
                            {
                              configAlphabet.map((alphabet) => (
                                <Select.Option value={alphabet}>{alphabet}</Select.Option>
                              ))
                            }
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={6}>
                        <Form.Item
                          label='Phone column'
                          name='phoneColumn'
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
                        >
                          <Select>
                            {
                              configAlphabet.map((alphabet) => (
                                <Select.Option value={alphabet}>{alphabet}</Select.Option>
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
                                <Select.Option value={alphabet}>{alphabet}</Select.Option>
                              ))
                            }
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={6}>
                        <Form.Item
                          label='Data start row'
                          name='dataStartRow'
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
              <Button style={{ width: '100%', margin: '20px' }} type='primary' htmlType='submit'>
                Upload
              </Button>
            </div>
          </Form>

        </Box>
      </CardContent>
    </Card >
  );
};
