import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-query-form',
  templateUrl: './query-form.component.html',
  styleUrls: ['./query-form.component.scss']
})
export class QueryFormComponent {
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

  private apiUrl = 'http://192.168.60.184:8080/orderMngrAX/restcall/orders/evaluateShipmentCosts';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.queryForm = this.fb.group({
      forwarder: ['', Validators.required], // Selector (Dropdown)
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]], // 5-digit ZIP
      city: ['', Validators.required],
      county: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]], // 2 chars only
      length: [null, [Validators.required, Validators.min(1)]], // Positive numbers
      width: [null, [Validators.required, Validators.min(1)]],
      height: [null, [Validators.required, Validators.min(1)]],
      weight: [null, [Validators.required, Validators.min(1)]],
      adr: [false] // Boolean checkbox
    });
  }

  onSubmit(): void {
    if (this.queryForm.invalid) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    // Extract form values
    const requestBody = this.queryForm.value;

    // Send API request
    this.http.post(
        this.apiUrl, 
        requestBody,
        { 
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Language', 'IT-it')
        }
      )
      .subscribe({
      next: (response: any) => {
        console.log(response);
        this.shipmentCostDetails = response.shipmentCostDetails; // Populate the response object
      },
      error: (error) => {
        console.error('API request failed:', error);
        alert('Failed to retrieve shipment costs. Please try again.');
      }
    });
  }
}
