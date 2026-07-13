import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private http = inject(HttpClient);

  getOrganization(domain: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/organization/get-org`, {
      domain: domain
    });
  }

  getSettings(outletId: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/setting/get`, {
      outletId: outletId,
      belongsTo: environment.belongsTo
    });
  }
}
