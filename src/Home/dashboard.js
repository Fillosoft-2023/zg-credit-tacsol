import React, { useEffect, useState } from 'react';
import { Typography, Paper, TableContainer, Table, TableBody, TableRow, TableCell, TableHead, Container, Grid, Divider } from '@material-ui/core';
import Api from '../api/api';
import { useHistory } from 'react-router-dom';
import ChartComponent from './dashboardCharts';
import DashboardCharts2 from './dashboardCharts2';
import DashboardCharts3 from './dashboardCharts3';
import 'chart.js/auto';

import { Chart, ArcElement, Linear } from 'chart.js'
Chart.register(ArcElement);


export default function Dashboard() {
  const history = useHistory();

  const [Data, setData] = useState({
    loan: [],
    sav: [],
    rd: [],
    ta: [],
    employee: [],
    share: [],
    policy: []
  });

  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(Api + 'memberCount', {
          method: 'POST',
          credentials: 'include',
        });

        if (response.ok) {
          const res = await response.json();
          setData({
            loan: ["Loan Member", res.loan_mem.tot_loan, res.loan_mem_mat.tot_loan_mat, Number(res.loan_mem.tot_loan) - Number(res.loan_mem_mat.tot_loan_mat)],
            sav: ["Savings Member", res.savings_mem.tot_sav, res.savings_mem.tot_closed_sav, res.savings_mem.tot_sav - res.savings_mem.tot_closed_sav],
            rd: ["RD Member", res.rd_mem.tot_rd, res.rd_mem.tot_closed_rd, res.rd_mem.tot_rd - res.rd_mem.tot_closed_rd],
            ta: ["TL Member", res.ta_mem.tot_ta, res.ta_mem_mat.tot_ta_mat, Number(res.ta_mem.tot_ta) - Number(res.ta_mem_mat.tot_ta_mat)],
            employee: ["Employee", res.employee_mem.tot_employee, 0, res.employee_mem.tot_employee],
            share: ["Share Member", res.share_mem.tot_share, 0, res.share_mem.tot_share],
            policy: ["Policy Member", res.policy_info.total_policy, 0, res.policy_info.tot_pli_mat]
          });

          // Create chart data
          const chartLabels = ['Loan', 'Savings', 'RD', 'TL', 'Share', 'Employee', 'Policy'];
          const chartData = {
            labels: chartLabels,
            datasets: [
              {
                label: 'Total Member',
                backgroundColor: 'rgba(75,192,192,0.6)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(75,192,192,0.8)',
                hoverBorderColor: 'rgba(220,220,220,1)',
                data: [
                  res.loan_mem.tot_loan,
                  res.savings_mem.tot_sav,
                  res.rd_mem.tot_rd,
                  res.ta_mem.tot_ta,
                  res.share_mem.tot_share,
                  res.employee_mem.tot_employee,
                  res.policy_info.total_policy
                ]
              },
              {
                label: 'Completed Member',
                backgroundColor: 'rgba(255,99,132,0.6)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.8)',
                hoverBorderColor: 'rgba(220,220,220,1)',
                data: [
                  res.loan_mem_mat.tot_loan_mat,
                  res.savings_mem.tot_closed_sav,
                  res.rd_mem.tot_closed_rd,
                  res.ta_mem_mat.tot_ta_mat,
                  0,
                  0,
                  res.policy_info.tot_pli_mat
                ]
              },
              {
                label: 'Active Member',
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)',
                hoverBorderColor: 'rgba(220,220,220,1)',
                data: [
                  res.loan_mem.tot_loan - res.loan_mem_mat.tot_loan_mat,
                  res.savings_mem.tot_sav - res.savings_mem.tot_closed_sav,
                  res.rd_mem.tot_rd - res.rd_mem.tot_closed_rd,
                  res.ta_mem.tot_ta - res.ta_mem_mat.tot_ta_mat,
                  res.share_mem.tot_share,
                  res.employee_mem.tot_employee,
                  res.policy_info.total_policy - res.policy_info.tot_pli_mat
                ]
              }
            ]
          };
          setChartData(chartData);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const hasReloaded = localStorage.getItem('hasReloaded');

    if (!hasReloaded && history.action === 'POP') {
      localStorage.setItem('hasReloaded', true);
      window.location.reload();
    }
  }, [history]);

  return (
    <Container maxWidth="xxl" component={Paper} style={{ minHeight: '93vh', backgroundColor: '#f8f9fa' }}>
      <DashboardCharts2 />
      <Grid container spacing={2} style={{ marginTop: 10 }}>
        <Grid item sm={6} xs={12} md={6} >
          {chartData && <ChartComponent chartData={chartData} />}
        </Grid>
        <Grid item sm={6} xs={12} md={6} >
          <DashboardCharts3 />
        </Grid>

      </Grid>



    </Container>
  );
}
