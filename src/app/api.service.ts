import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string = '';              // Back-compat: default chosen base (set in initializeBaseUrl)
  private ip: string = '';

  // Define your two bases here (adjust if needed)
  private readonly privateBase = 'http://192.168.60.184:8080/orderMngrAX/restcall/';
  private readonly publicBase  = 'http://188.219.225.106:8070/orderMngrAX/restcall/';

  // What initializeBaseUrl() detects as the preferred default when no override is given
  private preferPrivateByDetection = false;

  constructor(private http: HttpClient) {}

  async initializeBaseUrl(): Promise<void> {
    try {
      this.ip = await this.getPublicIP();

      // Keep your original heuristic (fixed the small typo):
      // If public IP starts with 188 or 5, use private; otherwise use public.
      // (Adjust this logic if your environment changes.)
      this.preferPrivateByDetection = !!this.ip && this.ip.startsWith('188');

      this.baseUrl = this.preferPrivateByDetection ? this.privateBase : this.publicBase;
    } catch (e) {
      console.warn('Public IP detection failed; using public base as fallback.', e);
      this.preferPrivateByDetection = false;
      this.baseUrl = this.publicBase;
    }

    console.log('Public IP:', this.ip || '(unknown)');
    console.log('Default (detected) base URL set to:', this.baseUrl);
  }

  /**
   * Returns the base URL.
   * - If usePrivate is provided, it **overrides** detection (true = private, false = public).
   * - If omitted, returns the **detected default** from initializeBaseUrl().
   */
  getBaseUrl(usePrivate?: boolean): string {
    if (typeof usePrivate === 'boolean') {
      return usePrivate ? this.privateBase : this.publicBase;
    }
    return this.baseUrl; // detected default
  }

  private getPublicIP(): Promise<string> {
    return this.http
      .get<any>('https://api.ipify.org?format=json')
      .toPromise()
      .then(res => res?.ip as string);
  }
}
