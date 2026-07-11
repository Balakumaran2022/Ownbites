import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Banner } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private http = inject(HttpClient);

  getBanners(outletId: string): Observable<Banner[]> {
    return this.http.post<{success: boolean, data: Banner[]}>(`${environment.apiUrl}/banner/get-active`, {
      belongsTo: environment.belongsTo,
      outletId: outletId
    }).pipe(map(res => res.data));
  }
}
