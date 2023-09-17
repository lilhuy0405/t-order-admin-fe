import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon, Typography, Grid, Container
} from '@mui/material';
import { Search as SearchIcon } from '../../icons/search';
import { Upload as UploadIcon } from '../../icons/upload';
import { Download as DownloadIcon } from '../../icons/download';
import { Select } from 'antd';
import { useQuery } from 'react-query';
import torderApi from '../../services/torderApi';

export const CustomerListToolbar = (props) => {
  const {
    data: shippingUnits = [],
    isLoading: shippingUnitsLoading
  } =
    useQuery(['torderApi.getListShippingUnits'], () => torderApi.getListShippingUnits());
  return (
    <Box {...props}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          m: -1
        }}
      >
        <Typography
          sx={{ m: 1 }}
          variant="h4"
        >
          List Orders
        </Typography>

      </Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                lg={4}
                xl={4}
                xs={12}
                md={4}
              >
                <Box sx={{ maxWidth: 300 }}>
                  <TextField
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SvgIcon
                            color="action"
                            fontSize="small"
                          >
                            <SearchIcon/>
                          </SvgIcon>
                        </InputAdornment>
                      )
                    }}
                    placeholder="Search by phone number"
                    variant="outlined"
                    onChange={(e) => {
                      props.setSearchParams({
                        ...props.searchParams,
                        phoneNumber: e.target.value,
                        page: 0
                      });
                    }}
                  />
                </Box>
              </Grid>
              <Grid
                item
                lg={4}
                xl={4}
                xs={12}
                md={4}
              >
                <Box sx={{ maxWidth: 300 }}>
                  <TextField
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SvgIcon
                            color="action"
                            fontSize="small"
                          >
                            <SearchIcon/>
                          </SvgIcon>
                        </InputAdornment>
                      )
                    }}
                    placeholder="Search by ship code"
                    variant="outlined"
                    onChange={(e) => {
                      props.setSearchParams({
                        ...props.searchParams,
                        shipCode: e.target.value,
                        page: 0
                      });
                    }}
                  />
                </Box>
              </Grid>
              <Grid
                item
                lg={4}
                xl={4}
                xs={12}
                md={4}
              >
                <Box sx={{ maxWidth: 300 }}>
                  <Select
                    size="large"
                    loading={shippingUnitsLoading}
                    style={{ width: '100%' }}
                    placeholder="Select a shipping unit"
                    onChange={(value) => {
                      props.setSearchParams({
                        ...props.searchParams,
                        shippingUnitId: value,
                        page: 0
                      });
                    }}
                  >
                    {
                      shippingUnits.map((shippingUnit) => (
                        <Select.Option value={shippingUnit.id} key={shippingUnit.id}>
                          {shippingUnit.name}
                        </Select.Option>
                      ))
                    }
                  </Select>
                </Box>
              </Grid>
            </Grid>

          </CardContent>
        </Card>
      </Box>
    </Box>
  );

};
