import Head from 'next/head';
import { Box, Container, Typography } from '@mui/material';
import { DashboardLayout } from '../components/dashboard-layout';
import { Upload, Checkbox, Button, Table, Select } from 'antd';
import xlsx from 'xlsx';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { fromByteToMB, toExcelColName } from '../utils';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { ORDER_FIELDS } from '../constants';
import { useQuery } from 'react-query';
import torderApi from '../services/torderApi';
import { useRouter } from 'next/router';
import usePrivateRoute from '../hooks/usePrivateRoute';

const ALLOWED_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel'

];
const initialDataMapping = ORDER_FIELDS.filter((x) => x.required).map((item) => ({
  excelColName: '',
  torderColName: item.name,
  id: item.name
}));
const UploadOrders = () => {
  usePrivateRoute();
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listColumnNames, setListColumnNames] = useState([]);
  const [startRow, setStartRow] = useState(0);
  const [previewData, setPreviewData] = useState({
    columns: [],
    data: []
  });
  const [dataMapping, setDataMapping] = useState(initialDataMapping);
  const [shippingUnit, setShippingUnit] = useState(null);

  //remove selected field from cdpFieldOptions
  const tOrdersFieldOptions = useMemo(() => {
    return ORDER_FIELDS.filter((x) => {
      const mappedFields = dataMapping.map((config) => config.torderColName);
      return !mappedFields.includes(x.name);
    }).map(item => ({
      label: item.label,
      value: item.name
    }));
  }, [ORDER_FIELDS, dataMapping]);

  const {
    data: shippingUnits = [],
    isLoading: shippingUnitsLoading
  } =
    useQuery(['torderApi.getListShippingUnits'], () => torderApi.getListShippingUnits());
  console.log('shippingUnits', shippingUnits);

  //remove selected column from excelColumnNameOptions
  const excelColumnNameOptions = useMemo(() => {
    return listColumnNames.filter((x) => {
      const mappedColumns = dataMapping.map((config) => config.excelColName);
      return !mappedColumns.includes(x);
    }).map((item) => ({
      label: item,
      value: item
    }));
  }, [listColumnNames, dataMapping]);

  const dataMappingColumns = [
    {
      title: 'Map to T-order field',
      dataIndex: 'torderColName',
      key: 'torderColName',
      render: (text, record) => {
        return <Select
          value={text}
          onChange={(value) => {
            const newDataMapping = [...dataMapping];
            const index = newDataMapping.findIndex(item => item.id === record.id);
            newDataMapping[index].torderColName = value;
            setDataMapping(newDataMapping);
          }}
          style={{ width: 200 }}>
          {
            tOrdersFieldOptions.map((item) => (
              <Select.Option value={item.value} key={item.label}>{item.label}</Select.Option>
            ))
          }
        </Select>;
      }
    },
    {
      title: 'Excel column name',
      dataIndex: 'excelColName',
      key: 'excelColName',
      render: (text, record) => {
        return (
          <Select
            style={{ width: 200 }}
            value={text}
            onChange={(value) => {
              const newDataMapping = [...dataMapping];
              const index = newDataMapping.findIndex(item => item.id === record.id);
              newDataMapping[index].excelColName = value;
              setDataMapping(newDataMapping);
            }}
          >
            {
              excelColumnNameOptions.map((item) => (
                <Select.Option key={item.key} value={item.value}>{item.label}</Select.Option>
              ))
            }
          </Select>
        );
      }
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => {
        return (
          <Button
            danger
            onClick={() => {
              const newDataMapping = [...dataMapping];
              const index = newDataMapping.findIndex(item => item.id === record.id);
              newDataMapping.splice(index, 1);
              setDataMapping(newDataMapping);
            }}
          >
            Remove
          </Button>
        );
      }
    }

  ];

  useEffect(() => {
    let startRowCol = previewData.columns[0];
    if (!startRowCol) {
      return;
    }
    startRowCol = {
      ...startRowCol,
      render: (_, record) => (
        <Checkbox
          checked={record.rowNumber === startRow}
          onChange={() => {
            const startRow = record.rowNumber;
            setStartRow(startRow);
          }}/>
      )
    };
    const newColumns = previewData.columns.map((item) => {
      if (item.dataIndex === 'dataStartRow') {
        return startRowCol;
      }
      return item;
    });
    setPreviewData({
      ...previewData,
      columns: newColumns
    });
  }, [startRow]);

  const processFile = async (file) => {
    try {
      setLoading(true);
      const fileBuffer = await file.arrayBuffer();
      const workbook = xlsx.read(fileBuffer, { sheetRows: 20 });
      const sheetsList = workbook.SheetNames;
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetsList[0]], {
        header: 1,
        defval: '',
        blankrows: true
      });
      //build antd table columns
      const listColumnNames = [];
      const columns = sheetData[0].map((_, index) => {
        listColumnNames.push(toExcelColName(index));
        return {
          title: toExcelColName(index),
          dataIndex: index,
          key: index
          // render: (text: any) => <div style={{
          //   maxWidth: 200,
          // }}>
          //   {text}
          // </div>
        };
      });
      setListColumnNames(listColumnNames);
      //add row number column
      columns.unshift({
        title: '#',
        dataIndex: 'rowNumber',
        key: 'key',
        render: (text) => <b>{text}</b>,
        fixed: 'left'
      });

      columns.unshift({
        title: 'Data start',
        width: 100,
        dataIndex: 'dataStartRow',
        key: 'key',
        render: (_, record) => (
          <Checkbox
            onChange={() => {
              const startRow = record.rowNumber;
              setStartRow(startRow);
            }}/>
        ),
        fixed: 'left'
      });
      // console.log('columns', columns)
      const data = sheetData.map((row, index) => {
        return {
          key: index,
          rowNumber: index + 1,
          ...Object.assign({}, row)
        };
      });
      // console.log('data', data)
      setPreviewData({
        columns,
        data
      });
      setFile(file);
      setStartRow(0);
    } catch (err) {
      throw new Error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChooseFile = async ({ file }) => {
    await toast.promise(processFile(file), {
      loading: 'Loading file...',
      success: 'File loaded successfully, you can see preview below.',
      error: 'File loaded failed, please try again.'
    });
  };

  const uploadPromise = async () => {
    try {
      setLoading(true);
      if (!file) {
        throw new Error('Please choose file');
      }
      //validate data mapping
      const missingFields = [];
      const requiredFields = ORDER_FIELDS.filter((x) => x.required).map((item) => item.name);
      requiredFields.forEach((requiredField) => {
        const mappedField = dataMapping.find((x) => x.torderColName
          === requiredField
          && x.excelColName);
        if (!mappedField) {
          missingFields.push(requiredField);
        }
      });
      if (missingFields.length > 0) {
        throw new Error(`Please map all required fields: ${missingFields.join(', ')}`);
      }

      if (!startRow) {
        throw new Error(`Please choose start row`);
      }
      const formData = new FormData();
      formData.append('file', file);
      formData.append('dataStartRow', startRow);
      dataMapping.forEach((item) => {
        formData.append(`${item.torderColName}Column`, item.excelColName);
      });
      if (shippingUnit) {
        formData.append('shippingUnitId', shippingUnit);
      }
      const res = await torderApi.uploadOrder(formData);
      console.log(res);
      router.push('/orders');
    } catch (err) {
      console.log(err);
      throw new Error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleUpload = async () => {
    toast.promise(uploadPromise(), {
      loading: 'Uploading file...',
      success: 'File uploaded successfully.',
      error: err => `${err.message}`
    });
  };

  return (
    <>
      <Head>
        <title>
          Upload Orders | Torder Dashboard
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth={false}>
          <Typography variant="h4" sx={{
            marginBottom: 2
          }}>Upload orders</Typography>

          <Upload.Dragger
            accept={ALLOWED_TYPES.join(', ')}
            showUploadList={false}
            customRequest={handleChooseFile}
            height={150}
            disabled={loading}
          >

            <div className="flex-row justify-content-center">

              <div style={{ marginBottom: 20 }}>
                Drag CDP excel file here.
              </div>
              {
                file ? (
                  <div>
                    <div style={{ marginBottom: 2 }}>Current
                      file: <b>{file?.name}</b> {fromByteToMB(file?.size
                        ?? 0)} MB
                    </div>
                  </div>
                ) : (
                  <Button size="large" icon={<AiOutlineCloudUpload/>} loading={loading}>
                    Choose file
                  </Button>
                )
              }

            </div>
          </Upload.Dragger>
          <div style={{ marginTop: 30 }}>
            <Typography variant="h5" sx={{
              marginBottom: 1
            }}>Excel preview:</Typography>
            <div style={{ marginBottom: 16 }}>Please check the row where your data start</div>
            <Table
              size="small"
              dataSource={previewData?.data ?? []}
              columns={previewData.columns ?? []}
              pagination={false}
              scroll={{ x: 'max-content', y: 300 }}
              bordered={true}
            />
          </div>
          <div style={{ marginTop: 30 }}>
            <Typography variant="h5" sx={{
              marginBottom: 1
            }}>Data mapping:</Typography>
            <div style={{ marginBottom: 16 }}>Map your excel data to t-order data</div>
            <Table
              size="small"
              dataSource={dataMapping}
              columns={dataMappingColumns.map((item) => ({
                ...item,
                key: item.id
              }))}
              pagination={false}
              footer={() => (
                <Button
                  type="primary"
                  onClick={() => {
                    const newRecord = {
                      excelColName: '',
                      torderColName: '',
                      id: new Date().getTime()
                    };
                    setDataMapping([
                      ...dataMapping,
                      newRecord
                    ]);
                  }}
                  disabled={excelColumnNameOptions.length === 0}
                >Add Field</Button>
              )}
            />
          </div>
          <div style={{ marginTop: 20 }}>
            <Typography variant="h5" sx={{
              marginBottom: 1
            }}>Choose shipping Unit:</Typography>
            <div style={{ marginBottom: 16 }}>Chose shipping unit for this file</div>
            <Select
              loading={shippingUnitsLoading}
              onChange={(value) => {
                setShippingUnit(value);
              }}
              value={shippingUnit}
              placeholder={'Choose shipping unit'}
              style={{ width: 300 }}>
              {
                shippingUnits.map((shippingUnit) => (
                  <Select.Option value={shippingUnit.id} key={shippingUnit.id}>
                    {shippingUnit.name}
                  </Select.Option>
                ))
              }
            </Select>
          </div>
          <div style={{ marginTop: 40, marginBottom: 10 }}>
            <Button
              onClick={handleUpload}
              type="primary"
              size="large" style={{
              width: '100%'
            }}>
              Upload
            </Button>
          </div>
        </Container>
      </Box>
    </>
  );
};

UploadOrders.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default UploadOrders;
