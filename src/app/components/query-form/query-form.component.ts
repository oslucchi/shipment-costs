import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
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

    // Simulated API call (Replace with real API request)
    this.shipmentCostDetails = {
      cost: 100,
      baseCost: 80,
      fuelSurcharge: 10,
      additionalCosts: 5,
      disadvantageLocation: 3,
      adr: this.queryForm.value.adr ? 7 : 0,
      oversize: (this.queryForm.value.length > 200 || this.queryForm.value.width > 100) ? 15 : 0
    };
  }
}
