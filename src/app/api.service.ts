import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})


export class ApiService {
  private baseUrl: string = '';
  private ip: string = '';

  constructor(private http: HttpClient) {}

  async initializeBaseUrl(): Promise<void> {
    this.ip = await this.getPublicIP();

    if (this.ip) {
      this.baseUrl = (this.ip.startsWith('188')
        ? 'http://192.168.60.184:8080/'
        : 'http://188.219.225.106:8070/') + 'orderMngrAX/restcall/';
    }

    console.log('Base API URL set to:', this.baseUrl);
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  private getPublicIP(): Promise<string> {
    return this.http
      .get<any>('https://api.ipify.org?format=json')
      .toPromise()
      .then(res => res.ip);
  }
}
