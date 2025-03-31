// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { BehaviorSubject, Subscription } from 'rxjs';
// import { CurrentStock } from '../../models/current-stock';

// @Component({
//   selector: 'app-current-stock',
//   templateUrl: './current-stock.component.html',
//   styleUrls: ['./current-stock.component.scss']
// })


// export class CurrentStockComponent implements OnInit, OnDestroy {
//   CurrentStock: {
//     location?: string;
//     article?: string;
//     description?: string;
//     quantity?: number;
//   } | null = null;

//   private apiUrl = '';
//   private publicIP$ = new BehaviorSubject<string | null>(null); // Reactive public IP state
//   private ipSubscription!: Subscription;
//   currentStock: CurrentStock[] = [];

//   constructor(private http: HttpClient) 
//   {
//   }

//   ngOnInit(): void {
//     this.getPublicIP(); // Get the public IP on init

//     // ✅ Subscribe to publicIP changes and update apiUrl dynamically
//     this.ipSubscription = this.publicIP$.subscribe(ip => {
//       if (ip) {
//         this.apiUrl = (ip.startsWith("188")
//                         ? 'http://localhost:8080/' // http://192.168.60.184:8080/'
//                         : 'http://188.219.225.106:8070/') +
//                       'orderMngrAX/restcall/locations/getStockStatus';

//         console.log("Updated API URL:", this.apiUrl);
//       }
//     });

//     this.http.get(
//       this.apiUrl, 
//     ).subscribe({
//       next: (response: any) => {
//         console.log(response);
//         this.currentStock = response.currentStock;
//       },
//       error: error => {
//         console.error('API request failed:', error);
//         alert('Failed to retrieve shipment costs. Please try again.');
//       }
//     });
//   }

//   ngOnDestroy(): void {
//     this.ipSubscription.unsubscribe(); // ✅ Prevent memory leaks
//   }

//   getPublicIP(): void {
//     this.http.get<{ ip: string }>('https://api64.ipify.org?format=json').subscribe({
//       next: response => {
//         console.log('Public IP:', response.ip);
//         this.publicIP$.next(response.ip); // ✅ Update the BehaviorSubject
//       },
//       error: error => {
//         console.error('API request failed:', error);
//         alert('Failed to retrieve public address.');
//       }
//     });
//   }
// }


import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CurrentStock } from '../../models/current-stock'; // adjust path as needed
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-current-stock',
  templateUrl: './current-stock.component.html',
  styleUrls: ['./current-stock.component.scss']
})
export class CurrentStockComponent implements OnInit {
  public currentStock: CurrentStock[] = [];
  public apiUrl: string = '';

  constructor(private router: Router, private http: HttpClient, private apiService: ApiService) {}

  goBack(): void {
    this.router.navigate(['/']); // navigates to the root route = LandingComponent
  }

  async ngOnInit(): Promise<void> {

    try {
      const base = this.apiService.getBaseUrl();
      const fullUrl = base + 'locations/getStockStatus'; // or whatever endpoint you need
    
      console.log("API URL:", this.apiUrl);

      this.http.get<any>(
        fullUrl,
        { 
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Language', 'IT-it'),
          observe: "response"
        }
      ).subscribe({
        next: (response: any) => {
          console.log(response);
          this.currentStock = response.body.currentStock as CurrentStock[];
        },
        error: error => {
          console.error('API request failed:', error);
          alert('Failed to retrieve current stock. Please try again.');
        }
      });
    } catch (err) {
      console.error('Failed to retrieve IP:', err);
      alert('Could not determine server address.');
    }
  }
}
