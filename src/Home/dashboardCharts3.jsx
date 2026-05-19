import { Container, Divider, Paper, Typography } from '@material-ui/core';
import { Doughnut } from 'react-chartjs-2';
import React, { useEffect, useState } from 'react';
import Api from '../api/api';
import { Chart, ArcElement } from 'chart.js'
Chart.register(ArcElement);

function DashboardCharts3() {
    const [chartData, setChartData] = useState({
        labels: [
            'Total RD Deposit',
            'Total RD Withdrawal',
            'Total EMI Collection',
            'Total Loan Disbursed',
            'Total Fixed Deposit'
        ],
        datasets: [
            {
                label: 'Daily Charts',
                data: [0, 0, 0, 0, 0],
                backgroundColor: [
                    '#bee9e8',
                    '#62b6cb',
                    '#cae9ff',
                    '#5fa8d3',
                    '#ffd6ff'
                ],
                borderWidth: 1
            }
        ]
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(Api + 'moneyCountAll', {
                method: 'POST',
                body: JSON.stringify()
            });
            if (response.ok) {
                const result = await response.json();
                console.log('Fetched data:', result); // Log fetched data for debugging
                updateChartData(result);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            // Handle error state or show an error message
        }
    };

    const updateChartData = (result) => {
        // Update chartData state with fetched data
        setChartData(prevData => ({
            ...prevData,
            datasets: [{
                ...prevData.datasets[0],
                data: [
                    result.accounts_today.today_dep,
                    result.accounts_today.today_with,
                    result.emi_today.today_emi,
                    result.loan_today.today_loan,
                    result.fixed_account.ta_dep
                ]
            }]
        }));
    };

    return (
        <Container component={Paper} style={{ boxShadow: '0 2px 4px 0 rgba(0, 33, 247, 0.3)', minHeight: '530px', padding: 20 }} elevation={0}>
            <Typography variant="h5" style={{ textAlign: 'center', fontWeight: 'bold', padding: 10, color: 'grey' }}>
                Accounts
            </Typography>
            <div style={{ height: '100%', overflowX: 'hidden' }}>
                <Doughnut data={chartData}
                    options={{
                        maintainAspectRatio: false,
                        responsive: true,
                    }}
                    style={{ height: '530px', width: '100%' }}
                />
            </div>
        </Container>
    );
}

export default DashboardCharts3;
