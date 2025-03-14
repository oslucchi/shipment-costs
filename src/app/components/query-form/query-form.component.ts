import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-query-form',
  templateUrl: './query-form.component.html',
  styleUrls: ['./query-form.component.scss']
})
export class QueryFormComponent implements OnInit, OnDestroy {
  queryForm: FormGroup;
  shipmentCostDetails: {
    cost?: number;
    baseCost?: number;
    fuelSurcharge?: number;
    additionalCosts?: number;
    disadvantageLocation?: number;
    adr?: number;
    oversize?: number;
  } | null = null;

  private apiUrl = '';
  private publicIP$ = new BehaviorSubject<string | null>(null); // Reactive public IP state
  private ipSubscription!: Subscription;

  constructor(private fb: FormBuilder, private http: HttpClient) {
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

  ngOnInit(): void {
    this.getPublicIP(); // Get the public IP on init

    // ✅ Subscribe to publicIP changes and update apiUrl dynamically
    this.ipSubscription = this.publicIP$.subscribe(ip => {
      if (ip) {
        this.apiUrl = ip.startsWith("188")
          ? 'http://192.168.60.184:8080/orderMngrAX/restcall/orders/evaluateShipmentCosts'
          : 'http://188.219.225.106:8080/orderMngrAX/restcall/orders/evaluateShipmentCosts';

        console.log("Updated API URL:", this.apiUrl);
      }
    });
  }

  ngOnDestroy(): void {
    this.ipSubscription.unsubscribe(); // ✅ Prevent memory leaks
  }

  getPublicIP(): void {
    this.http.get<{ ip: string }>('https://api64.ipify.org?format=json').subscribe({
      next: response => {
        console.log('Public IP:', response.ip);
        this.publicIP$.next(response.ip); // ✅ Update the BehaviorSubject
      },
      error: error => {
        console.error('API request failed:', error);
        alert('Failed to retrieve public address.');
      }
    });
  }

  onSubmit(): void {
    if (this.queryForm.invalid) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    const requestBody = this.queryForm.value;

    this.http.post(
      this.apiUrl, 
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
