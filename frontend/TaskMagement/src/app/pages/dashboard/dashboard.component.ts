import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.loadTaskChart();
    this.loadWeatherChart();
  }

  loadTaskChart() {
    this.reportService.getTaskReport().subscribe((data: any) => {
      const labels = data.map((d: any) => d.status);
      const values = data.map((d: any) => d.count);

      new Chart('taskChart', {
        type: 'pie',
        data: {
          labels,
          datasets: [
            {
              data: values
            }
          ]
        }
      });
    });
  }

 loadWeatherChart() {
  this.reportService.getWeatherReport().subscribe((data: any) => {

    if (!data || data.length === 0) {
      console.log('No weather report data yet');
      return;
    }

    const labels = data.map((d: any) =>
      new Date(d.day).toLocaleDateString()
    );

    const values = data.map((d: any) => d.count);

    new Chart('weatherChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Weather Searches',   //  THIS FIXES "undefined"
            data: values,
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  });
}


}