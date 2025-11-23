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

  createRevenueProfitTrendsData(weeks: IWeek[]): ChartConfiguration<'line'>['data'] {
    if (!weeks || weeks.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    const sortedWeeks = [...weeks].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.weekNumber - b.weekNumber;
    });

    const last3Weeks = sortedWeeks.slice(-3);

    return {
      labels: last3Weeks.map(w => {
        const date = new Date(w.startDate);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      datasets: [
        {
          label: 'Buying Cost',
          data: last3Weeks.map(w => Number(w.totalBuyingPrice) || 0),
          borderColor: 'rgb(245, 158, 11)',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.4,
          fill: false,
          borderWidth: 3,
        },
        {
          label: 'Profit',
          data: last3Weeks.map(w => Number(w.profit) || 0),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: false,
          borderWidth: 3,
        },
        {
          label: 'Total Revenue',
          data: last3Weeks.map(w => Number(w.totalSale) || 0),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: false,
          borderWidth: 3,
        }
      ]
    };
  }

  createProfitSavingsBarData(weeks: IWeek[]): ChartConfiguration<'bar'>['data'] {
    if (!weeks || weeks.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    const sortedWeeks = [...weeks].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.weekNumber - b.weekNumber;
    });

    const last3Weeks = sortedWeeks.slice(-3);

    return {
      labels: last3Weeks.map(w => {
        const date = new Date(w.startDate);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      datasets: [
        {
          label: 'Profit',
          data: last3Weeks.map(w => Number(w.profit) || 0),
          backgroundColor: 'rgb(16, 185, 129)',
          borderRadius: 8,
        },
        {
          label: 'Savings',
          data: last3Weeks.map(w => Number(w.savings) || 0),
          backgroundColor: 'rgb(139, 92, 246)',
          borderRadius: 8,
        }
      ]
    };
  }

  createSalesByDayPieData(week: IWeek | null): ChartConfiguration<'pie'>['data'] {
    if (!week || !week.sale) {
      return {
        labels: ['Thursday', 'Friday', 'Saturday'],
        datasets: [{
          data: [0, 0, 0],
          backgroundColor: [
            'rgba(236, 72, 153, 0.8)',
            'rgba(168, 85, 247, 0.8)',
            'rgba(59, 130, 246, 0.8)',
          ],
        }]
      };
    }

    const sale = week.sale;
    const total = (sale.thursday || 0) + (sale.friday || 0) + (sale.saturday || 0);

    return {
      labels: [
        `Thursday ${total > 0 ? Math.round((sale.thursday / total) * 100) : 0}%`,
        `Friday ${total > 0 ? Math.round((sale.friday / total) * 100) : 0}%`,
        `Saturday ${total > 0 ? Math.round((sale.saturday / total) * 100) : 0}%`,
      ],
      datasets: [{
        data: [
          sale.thursday || 0,
          sale.friday || 0,
          sale.saturday || 0,
        ],
        backgroundColor: [
          'rgba(236, 72, 153, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
      }]
    };
  }

  createDailySalesTrendsData(weeks: IWeek[]): ChartConfiguration<'line'>['data'] {
    if (!weeks || weeks.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    const sortedWeeks = [...weeks].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.weekNumber - b.weekNumber;
    });

    const last3Weeks = sortedWeeks.slice(-3);

    return {
      labels: last3Weeks.map(w => {
        const date = new Date(w.startDate);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      datasets: [
        {
          label: 'Thursday Sales',
          data: last3Weeks.map(w => (w.sale?.thursday || 0)),
          borderColor: 'rgba(236, 72, 153, 1)',
          backgroundColor: 'rgba(236, 72, 153, 0.8)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Friday Sales',
          data: last3Weeks.map(w => (w.sale?.friday || 0)),
          borderColor: 'rgba(139, 92, 246, 1)',
          backgroundColor: 'rgba(139, 92, 246, 0.8)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Saturday Sales',
          data: last3Weeks.map(w => (w.sale?.saturday || 0)),
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          tension: 0.4,
          fill: true,
        }
      ]
    };
  }

  getSalesChartData(weeks: IWeek[]): ChartConfiguration<'bar'>['data'] {
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
      resizeDelay: 0,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            boxWidth: 12,
            padding: 10,
            font: {
              size: 12,
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          type: 'linear',
          ticks: {
            font: {
              size: 11,
            },
          },
        },
        x: {
          ticks: {
            font: {
              size: 11,
            },
          },
        },
      },
    };
  }

  getBarChartOptions(): ChartOptions<'bar'> {
    return {
      responsive: true,
      maintainAspectRatio: false,
      resizeDelay: 0,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            boxWidth: 12,
            padding: 10,
            font: {
              size: 12,
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          type: 'linear',
          ticks: {
            font: {
              size: 11,
            },
          },
        },
        x: {
          ticks: {
            font: {
              size: 11,
            },
          },
        },
      },
    };
  }

  getPieChartOptions(): ChartOptions<'pie'> {
    return {
      responsive: true,
      maintainAspectRatio: false,
      resizeDelay: 0,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            boxWidth: 12,
            padding: 10,
            font: {
              size: 12,
            },
          },
        },
      },
    };
  }
  
  getAreaChartOptions(): ChartOptions<'line'> {
    return this.getLineChartOptions();
  }
}
