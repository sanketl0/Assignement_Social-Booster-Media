import { Component } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-weather',
    imports: [CommonModule,ReactiveFormsModule,FormsModule],

  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent {
  city = '';
  weatherData: any;

  constructor(private weatherService: WeatherService) {}

  fetchWeather() {
    if (!this.city.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'City Required',
        text: 'Please enter a city name first.'
      });
      return;
    }

    // Show loading alert
    Swal.fire({
      title: 'Fetching Weather...',
      text: 'Please wait a moment',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.weatherService.getWeather(this.city).subscribe({
      next: (res: any) => {
        this.weatherData = res;

        // Success alert
        Swal.fire({
          icon: 'success',
          title: 'Weather Updated',
          text: `Weather data for ${res.city} loaded successfully!`,
          timer: 1500,
          showConfirmButton: false
        });
      },
      error: (err) => {
        // Error alert
        Swal.fire({
          icon: 'error',
          title: 'Failed to Fetch Weather',
          text: 'Something went wrong. Please try again.'
        });
      }
    });
  }
}

