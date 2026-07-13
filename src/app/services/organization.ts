import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OrgData {
  name: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  whatsAppNumber: string;
  city: string;
}

const DEFAULT_ORG: OrgData = {
  name: 'IEYAL',
  logoUrl: 'https://owncart.s3.ap-south-1.amazonaws.com/uploads/685670e4486951278738864e/images/kgnyk7_DYgRgrz8OZ9VTNsgqOaueZ1lh7QfjLnki17Rma64tcZ.jpeg',
  primaryColor: '#0c6cea',
  secondaryColor: '#082e16',
  whatsAppNumber: '918124188187',
  city: 'Aligarh'
};

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private http = inject(HttpClient);

  /** Live org data from API — pre-seeded with known defaults so logo/name load instantly */
  org = signal<OrgData>(DEFAULT_ORG);

  getOrganization(domain: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/organization/get-org`, { domain }).pipe(
      tap(res => {
        if (res?.status === 'success' && res?.data?.organization) {
          const o = res.data.organization;
          this.org.set({
            name:            o.name         || DEFAULT_ORG.name,
            logoUrl:         o.logoImage    || DEFAULT_ORG.logoUrl,
            primaryColor:    o.theme?.config?.primaryColor    || DEFAULT_ORG.primaryColor,
            secondaryColor:  o.theme?.config?.secondaryColor  || DEFAULT_ORG.secondaryColor,
            whatsAppNumber:  o.whatsAppNumber || DEFAULT_ORG.whatsAppNumber,
            city:            o.city         || DEFAULT_ORG.city
          });
        }
      })
    );
  }

  getSettings(outletId: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/setting/get`, {
      outletId: outletId,
      belongsTo: environment.belongsTo
    });
  }
}
