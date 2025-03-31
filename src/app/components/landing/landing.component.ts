import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  constructor(private router: Router, private apiService: ApiService) {}

  async ngOnInit(): Promise<void> {
    await this.apiService.initializeBaseUrl();
  }
  
  currentStock(): void {
    console.log('Current stock function called');
    this.router.navigate(['/current-stock']);
  }

  shipmentCost(): void {
    console.log('Shipment cost function called');
    this.router.navigate(['/shipment-costs']);
  }
}
