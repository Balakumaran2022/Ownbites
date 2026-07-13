import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private http = inject(HttpClient);

  reverseGeocode(latitude: number, longitude: number): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/location/customer-geo-location`, {
      latitude: latitude,
      longitude: longitude,
      belongsTo: environment.belongsTo
    });
  }

  forwardGeocode(enteredAddress: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/location/customer-get-latlng`, {
      enteredAddress: enteredAddress,
      belongsTo: environment.belongsTo
    });
  }
}
