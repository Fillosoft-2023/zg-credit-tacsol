import { Container, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';
Chart.register(ArcElement);

const ChartComponent = ({ chartData }) => {
  return (
    <Container component={Paper} style={{ boxShadow: '0 2px 4px 0 rgba(0, 33, 247, 0.3)', minHeight: '530px', padding: 20 }} elevation={0}>
      <Typography variant="h5" style={{ textAlign: 'center', fontWeight: 'bold', padding: 10, color: 'grey' }}>
        Members
      </Typography>
      <div style={{ height: '100%' }}>
        <Bar
          data={chartData}
          options={{
            maintainAspectRatio: false,
            responsive: true,
          }}
          style={{ minHeight: '530px', width: '100%' }}
        />
      </div>
    </Container>
  );
};

export default ChartComponent;
