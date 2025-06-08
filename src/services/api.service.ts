import { Injectable } from '@angular/core';
import { EnvironmentInterface } from 'src/definitions/enviroment.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  /**
   * Domain
   */
  private domain: URL;

  /**
   * Environment
   */
  private environment: EnvironmentInterface;
  constructor() {
    const currentUrl = new URL(window.location.href);
    this.environment = environment;
    this.domain = new URL(
      this.environment.apiPath,
      `${currentUrl.protocol}//${currentUrl.hostname}`
    );
    if (this.environment.apiPort) {
      this.domain.port = this.environment.apiPort.toString();
    }
  }

  getApiUrl(): string {
    return this.domain.toString();
  }
}
