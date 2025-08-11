import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  usePrivate = false;
  showPrivateToggle = false; // controls visibility of the div

  constructor(
    private router: Router,
    private apiService: ApiService,
    private http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    await this.apiService.initializeBaseUrl();

    try {
      const ip = await this.getPublicIP();
      console.log('Public IP (Landing):', ip);

      // Only show the toggle if NOT in the allowed list
      this.showPrivateToggle = !(ip === '188.219.225.106' || ip === '5.11.36.111');
    } catch (e) {
      console.warn('Could not determine public IP; hiding private toggle by default.', e);
      this.showPrivateToggle = false;
    }
  }

  private getPublicIP(): Promise<string> {
    return this.http
      .get<any>('https://api.ipify.org?format=json')
      .toPromise()
      .then(res => res?.ip as string);
  }

  currentStock(): void {
    this.router.navigate(['/current-stock']);
  }

  shipmentCost(): void {
    this.router.navigate(
      ['/shipment-costs'],
      { queryParams: { usePrivate: this.usePrivate ? 1 : 0 } }
    );
  }
}
