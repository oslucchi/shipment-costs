import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-shipment-costs',
  templateUrl: './shipment-costs.component.html',
  styleUrls: ['./shipment-costs.component.scss']
})
export class ShipmentCostsComponent implements OnInit {
  queryForm: FormGroup;

  // whether to use the private (non-routed) base URL, read from query param
  private usePrivate = false;

  shipmentCostDetails: {
    cost?: number;
    baseCost?: number;
    fuelSurcharge?: number;
    additionalCosts?: number;
    disadvantageLocation?: number;
    adr?: number;
    oversize?: number;
  } | null = null;

  private fullUrl = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {
    this.queryForm = this.fb.group({
      forwarder: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      city: ['', Validators.required],
      county: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      length: [null, [Validators.required, Validators.min(1)]],
      width: [null, [Validators.required, Validators.min(1)]],
      height: [null, [Validators.required, Validators.min(1)]],
      weight: [null, [Validators.required, Validators.min(1)]],
      adr: [false]
    });
  }

  goBack(): void {
    this.router.navigate(['/']); // navigates to the root route = LandingComponent
  }

  ngOnInit(): void {
    // Read query param (?usePrivate=1) once on init
    const qp = this.route.snapshot.queryParamMap;
    this.usePrivate = qp.get('usePrivate') === '1';

    // Compose base URL choosing private/public via ApiService (we'll adjust ApiService next)
    const base = this.apiService.getBaseUrl(this.usePrivate as any); // ApiService signature will be updated
    // Ensure no duplicate slashes
    this.fullUrl = `${String(base).replace(/\/+$/, '')}/orders/evaluateShipmentCosts`;

    console.log('Use private base:', this.usePrivate);
    console.log('API URL:', this.fullUrl);
  }

  onSubmit(): void {
    if (this.queryForm.invalid) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    const requestBody = this.queryForm.value;

    this.http.post(
      this.fullUrl,
      requestBody,
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Language', 'IT-it')
      }
    ).subscribe({
      next: (response: any) => {
        console.log(response);
        this.shipmentCostDetails = response.shipmentCostDetails;
      },
      error: error => {
        console.error('API request failed:', error);
        alert('Failed to retrieve shipment costs. Please try again.');
      }
    });
  }
}
