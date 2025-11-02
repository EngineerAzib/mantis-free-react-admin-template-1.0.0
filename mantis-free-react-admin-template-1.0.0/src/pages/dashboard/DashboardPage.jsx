import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  BarChart3, 
  PieChart,
  RefreshCw,
  Calendar,
  Clock,
  Target
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import * as dashboardAPI from '../../api/dashboard';
import MainCard from '../../components/MainCard';
import Loader from '../../components/Loader';

// Revenue Card Component
const RevenueCard = ({ title, value, icon: Icon, color = 'primary', trend, trendValue }) => (
  <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: `${color}.main`, mt: 1 }}>
            ${value?.toLocaleString() || '0'}
          </Typography>
        </Box>
        <Box sx={{ 
          p: 2, 
          borderRadius: 2, 
          bgcolor: `${color}.light`, 
          color: `${color}.main`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={24} />
        </Box>
      </Box>
      {trend && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {trend === 'up' ? (
            <TrendingUp size={16} color="#10b981" />
          ) : (
            <TrendingDown size={16} color="#ef4444" />
          )}
          <Typography variant="body2" sx={{ color: trend === 'up' ? 'success.main' : 'error.main' }}>
            {trendValue}% from last period
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

// Chart Card Component
const ChartCard = ({ title, children, height = 300 }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        {title}
      </Typography>
      <Box sx={{ height }}>
        {children}
      </Box>
    </CardContent>
  </Card>
);

// Simple Chart Component (placeholder for actual chart library)
const SimpleChart = ({ data, type = 'line', color = 'primary' }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <Box sx={{ 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'text.secondary'
      }}>
        <Typography>No data available</Typography>
      </Box>
    );
  }

  const entries = Object.entries(data);
  const maxValue = Math.max(...entries.map(([, value]) => value));

  return (
    <Box sx={{ height: '100%', p: 2 }}>
      {type === 'bar' ? (
        <Box sx={{ display: 'flex', alignItems: 'end', height: '100%', gap: 1 }}>
          {entries.map(([key, value]) => (
            <Box key={key} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box
                sx={{
                  width: '100%',
                  height: `${(value / maxValue) * 200}px`,
                  bgcolor: `${color}.main`,
                  borderRadius: 1,
                  mb: 1,
                  transition: 'all 0.3s ease'
                }}
              />
              <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                {key}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                ${value?.toFixed(0)}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Chart visualization would go here
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const DashboardPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  // Revenue queries
  const { data: dailyRevenue, isLoading: dailyRevenueLoading } = useQuery({
    queryKey: ['dailyRevenue', refreshKey],
    queryFn: dashboardAPI.GetDailyRevenue,
    staleTime: 5 * 60 * 1000,
  });

  const { data: weeklyRevenue, isLoading: weeklyRevenueLoading } = useQuery({
    queryKey: ['weeklyRevenue', refreshKey],
    queryFn: dashboardAPI.GetWeeklyRevenue,
    staleTime: 5 * 60 * 1000,
  });

  const { data: monthlyRevenue, isLoading: monthlyRevenueLoading } = useQuery({
    queryKey: ['monthlyRevenue', refreshKey],
    queryFn: dashboardAPI.GetMonthlyRevenue,
    staleTime: 5 * 60 * 1000,
  });

  const { data: yearlyRevenue, isLoading: yearlyRevenueLoading } = useQuery({
    queryKey: ['yearlyRevenue', refreshKey],
    queryFn: dashboardAPI.GetYearlyRevenue,
    staleTime: 5 * 60 * 1000,
  });

  // Sales data queries
  const { data: dailySalesData, isLoading: dailySalesDataLoading } = useQuery({
    queryKey: ['dailySalesData', refreshKey],
    queryFn: dashboardAPI.GetDailySalesData,
    staleTime: 5 * 60 * 1000,
  });

  const { data: weeklySalesData, isLoading: weeklySalesDataLoading } = useQuery({
    queryKey: ['weeklySalesData', refreshKey],
    queryFn: dashboardAPI.GetWeeklySalesData,
    staleTime: 5 * 60 * 1000,
  });

  const { data: yearlySalesData, isLoading: yearlySalesDataLoading } = useQuery({
    queryKey: ['yearlySalesData', refreshKey],
    queryFn: dashboardAPI.GetYearlySalesData,
    staleTime: 5 * 60 * 1000,
  });

  // Total sales queries
  const { data: totalDailySale, isLoading: totalDailySaleLoading } = useQuery({
    queryKey: ['totalDailySale', refreshKey],
    queryFn: dashboardAPI.GetTotalDailySale,
    staleTime: 5 * 60 * 1000,
  });

  const { data: totalWeeklySale, isLoading: totalWeeklySaleLoading } = useQuery({
    queryKey: ['totalWeeklySale', refreshKey],
    queryFn: dashboardAPI.GetTotalWeeklySale,
    staleTime: 5 * 60 * 1000,
  });

  const { data: totalMonthlySale, isLoading: totalMonthlySaleLoading } = useQuery({
    queryKey: ['totalMonthlySale', refreshKey],
    queryFn: dashboardAPI.GetTotalMonthlySale,
    staleTime: 5 * 60 * 1000,
  });

  const { data: totalYearlySale, isLoading: totalYearlySaleLoading } = useQuery({
    queryKey: ['totalYearlySale', refreshKey],
    queryFn: dashboardAPI.GetTotalYearlySale,
    staleTime: 5 * 60 * 1000,
  });

  // Profit queries
  const { data: dayProfit, isLoading: dayProfitLoading } = useQuery({
    queryKey: ['dayProfit', refreshKey],
    queryFn: dashboardAPI.GetDayProfit,
    staleTime: 5 * 60 * 1000,
  });

  const { data: weeklyProfit, isLoading: weeklyProfitLoading } = useQuery({
    queryKey: ['weeklyProfit', refreshKey],
    queryFn: dashboardAPI.GetWeeklyProfit,
    staleTime: 5 * 60 * 1000,
  });

  const { data: monthProfit, isLoading: monthProfitLoading } = useQuery({
    queryKey: ['monthProfit', refreshKey],
    queryFn: dashboardAPI.GetMonthProfit,
    staleTime: 5 * 60 * 1000,
  });

  const { data: yearProfit, isLoading: yearProfitLoading } = useQuery({
    queryKey: ['yearProfit', refreshKey],
    queryFn: dashboardAPI.GetYearProfit,
    staleTime: 5 * 60 * 1000,
  });

  // Profit data queries
  const { data: dailyProfitData, isLoading: dailyProfitDataLoading } = useQuery({
    queryKey: ['dailyProfitData', refreshKey],
    queryFn: dashboardAPI.GetDailyProfitData,
    staleTime: 5 * 60 * 1000,
  });

  const { data: weeklyProfitData, isLoading: weeklyProfitDataLoading } = useQuery({
    queryKey: ['weeklyProfitData', refreshKey],
    queryFn: dashboardAPI.GetWeeklyProfitData,
    staleTime: 5 * 60 * 1000,
  });

  const { data: yearlyProfitData, isLoading: yearlyProfitDataLoading } = useQuery({
    queryKey: ['yearlyProfitData', refreshKey],
    queryFn: dashboardAPI.GetYearlyProfitData,
    staleTime: 5 * 60 * 1000,
  });

  // Profit comparison queries
  const { data: dayProfitComparison, isLoading: dayProfitComparisonLoading } = useQuery({
    queryKey: ['dayProfitComparison', refreshKey],
    queryFn: dashboardAPI.GetDayProfitComparison,
    staleTime: 5 * 60 * 1000,
  });

  const { data: weekProfitComparison, isLoading: weekProfitComparisonLoading } = useQuery({
    queryKey: ['weekProfitComparison', refreshKey],
    queryFn: dashboardAPI.GetWeekProfitComparison,
    staleTime: 5 * 60 * 1000,
  });

  const { data: yearProfitComparison, isLoading: yearProfitComparisonLoading } = useQuery({
    queryKey: ['yearProfitComparison', refreshKey],
    queryFn: dashboardAPI.GetYearProfitComparison,
    staleTime: 5 * 60 * 1000,
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const isLoading = dailyRevenueLoading || weeklyRevenueLoading || monthlyRevenueLoading || 
                   yearlyRevenueLoading || dailySalesDataLoading || weeklySalesDataLoading || 
                   yearlySalesDataLoading || totalDailySaleLoading || totalWeeklySaleLoading || 
                   totalMonthlySaleLoading || totalYearlySaleLoading || dayProfitLoading || 
                   weeklyProfitLoading || monthProfitLoading || yearProfitLoading || 
                   dailyProfitDataLoading || weeklyProfitDataLoading || yearlyProfitDataLoading || 
                   dayProfitComparisonLoading || weekProfitComparisonLoading || yearProfitComparisonLoading;

  return (
    <MainCard title="Dashboard">
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Business Analytics
          </Typography>
          <Chip 
            label="Real-time" 
            color="success" 
            size="small" 
            icon={<Clock size={14} />}
          />
        </Box>
        <Tooltip title="Refresh Data">
          <IconButton onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw size={20} />
          </IconButton>
        </Tooltip>
      </Box>

      {isLoading && <Loader />}

      {/* Revenue Overview */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <DollarSign size={20} />
          Revenue Overview
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <RevenueCard
              title="Daily Revenue"
              value={dailyRevenue}
              icon={Calendar}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <RevenueCard
              title="Weekly Revenue"
              value={weeklyRevenue}
              icon={TrendingUp}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <RevenueCard
              title="Monthly Revenue"
              value={monthlyRevenue}
              icon={BarChart3}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <RevenueCard
              title="Yearly Revenue"
              value={yearlyRevenue}
              icon={Target}
              color="warning"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Sales Overview */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShoppingCart size={20} />
          Sales Overview
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <RevenueCard
              title="Daily Sales"
              value={totalDailySale}
              icon={Clock}
              color="secondary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <RevenueCard
              title="Weekly Sales"
              value={totalWeeklySale}
              icon={TrendingUp}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <RevenueCard
              title="Monthly Sales"
              value={totalMonthlySale}
              icon={BarChart3}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <RevenueCard
              title="Yearly Sales"
              value={totalYearlySale}
              icon={Target}
              color="warning"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Charts Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <BarChart3 size={20} />
          Sales Analytics
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ChartCard title="Daily Sales Trend" height={300}>
              <SimpleChart data={dailySalesData} type="bar" color="primary" />
            </ChartCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <ChartCard title="Weekly Sales Pattern" height={300}>
              <SimpleChart data={weeklySalesData} type="bar" color="success" />
            </ChartCard>
          </Grid>
          <Grid item xs={12}>
            <ChartCard title="Yearly Sales Distribution" height={300}>
              <SimpleChart data={yearlySalesData} type="bar" color="info" />
            </ChartCard>
          </Grid>
        </Grid>
      </Box>

      {/* Profit Analysis */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <PieChart size={20} />
          Profit Analysis
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <RevenueCard
              title="Daily Profit"
              value={dayProfit}
              icon={TrendingUp}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <RevenueCard
              title="Weekly Profit"
              value={weeklyProfit}
              icon={BarChart3}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <RevenueCard
              title="Monthly Profit"
              value={monthProfit}
              icon={Target}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <RevenueCard
              title="Yearly Profit"
              value={yearProfit}
              icon={PieChart}
              color="secondary"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Profit Charts */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUp size={20} />
          Profit Trends
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <ChartCard title="Daily Profit Trend" height={250}>
              <SimpleChart data={dailyProfitData} type="bar" color="success" />
            </ChartCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <ChartCard title="Weekly Profit Pattern" height={250}>
              <SimpleChart data={weeklyProfitData} type="bar" color="info" />
            </ChartCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <ChartCard title="Yearly Profit Distribution" height={250}>
              <SimpleChart data={yearlyProfitData} type="bar" color="warning" />
            </ChartCard>
          </Grid>
        </Grid>
      </Box>

      {/* Profit Comparison */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingDown size={20} />
          Profit Comparison
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <ChartCard title="Daily Profit Comparison" height={250}>
              <SimpleChart data={dayProfitComparison} type="bar" color="primary" />
            </ChartCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <ChartCard title="Weekly Profit Comparison" height={250}>
              <SimpleChart data={weekProfitComparison} type="bar" color="success" />
            </ChartCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <ChartCard title="Yearly Profit Comparison" height={250}>
              <SimpleChart data={yearProfitComparison} type="bar" color="info" />
            </ChartCard>
          </Grid>
        </Grid>
      </Box>
    </MainCard>
  );
};

export default DashboardPage;
