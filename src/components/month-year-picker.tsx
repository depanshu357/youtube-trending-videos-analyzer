// components/MonthYearRangePicker.jsx
'use client';

import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { TextField, Box } from '@mui/material';

const MonthYearRangePicker = ({startDate, setStartDate, endDate, setEndDate}) => {
//   const [startDate, setStartDate] = useState(dayjs());
//   const [endDate, setEndDate] = useState(dayjs());

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" alignItems="center" gap={1}>
        <DatePicker
          label="Start Month"
          views={['year', 'month']}
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)}
          slotProps={{
            textField: {
              size: 'small',
              sx: {
                width: 170,
                '& .MuiInputBase-root': {
                  height: 32,
                  fontSize: '0.875rem',
                },
              },
            },
          }}
        />
        <span className="text-gray-500">to</span>
        <DatePicker
          label="End Month"
          views={['year', 'month']}
          value={endDate}
          onChange={(newValue) => setEndDate(newValue)}
          slotProps={{
            textField: {
              size: 'small',
              sx: {
                width: 170,
                '& .MuiInputBase-root': {
                  height: 32,
                  fontSize: '0.875rem',
                },
              },
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default MonthYearRangePicker;
