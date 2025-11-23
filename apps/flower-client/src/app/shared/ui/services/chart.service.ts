import { Injectable } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { IWeek } from '../../models/week.model';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  createProfitChartData(weeks: IWeek[]): ChartConfiguration<'line'>['data'] {
    if (!weeks || weeks.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: 'Profit (€)',
          data: [],
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4,
          fill: true,
        }]
      };
    }

    const sortedWeeks = [...weeks].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.weekNumber - b.weekNumber;
    });

    return {
      labels: sortedWeeks.map(w => `W${w.weekNumber}/${w.year}`),
      datasets: [{
        label: 'Profit (€)',
        data: sortedWeeks.map(w => Number(w.profit) || 0),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      }]
    };
  }

  createSalesChartData(weeks: IWeek[]): ChartConfiguration<'bar'>['data'] {
    const weeksWithSales = weeks.filter(w => w.sale);
    const last4Weeks = weeksWithSales.slice(-4);
    
    if (last4Weeks.length === 0) {
      return {
        labels: ['Thursday', 'Friday', 'Saturday'],
        datasets: []
      };
    }

    return {
      labels: ['Thursday', 'Friday', 'Saturday'],
      datasets: last4Weeks.map((week, index) => {
        const sale = week.sale || { thursday: 0, friday: 0, saturday: 0 };
        return {
          label: `Week ${week.weekNumber}`,
          data: [
            Number(sale.thursday) || 0,
            Number(sale.friday) || 0,
            Number(sale.saturday) || 0
          ],
          backgroundColor: `rgba(${59 + index * 20}, ${130 + index * 30}, ${246 - index * 20}, 0.7)`,
        };
      })
    };
  }

  getLineChartOptions(): ChartOptions<'line'> {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          type: 'linear',
        },
      },
    };
  }

  getBarChartOptions(): ChartOptions<'bar'> {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          type: 'linear',
        },
      },
    };
  }
}

