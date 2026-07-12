import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  public orderUpdates$ = new Subject<{ orderId: string, status: string }>();
  private socket: WebSocket | null = null;
  private activeSimulations = new Set<string>();
  private reconnectTimer: any = null;

  constructor() {
    this.tryConnect();
  }

  private tryConnect() {
    // Skip real WebSocket when no API URL configured (dev / simulation-only mode)
    const apiUrl = environment.apiUrl || '';
    if (!apiUrl || apiUrl === '' || /localhost/i.test(apiUrl)) {
      // Simulation-only mode — no real WS connection needed
      return;
    }

    try {
      const wsUrl = apiUrl.replace(/^https?/, 'wss') + '/ws';
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('[WebSocket] Connected to backend.');
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data?.orderId && data?.status) {
            this.orderUpdates$.next({ orderId: data.orderId, status: data.status });
          }
        } catch { /* non-JSON frame, ignore */ }
      };

      this.socket.onerror = () => { /* silently handled by onclose */ };

      this.socket.onclose = () => {
        if (!this.reconnectTimer) {
          this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.tryConnect();
          }, 10000);
        }
      };
    } catch { /* WebSocket not supported or blocked */ }
  }

  /** Simulate live order status progression for demo/dev environments */
  public startOrderStatusSimulation(orderId: string) {
    if (this.activeSimulations.has(orderId)) return;
    this.activeSimulations.add(orderId);

    const statuses = ['Pending', 'Preparing', 'Ready', 'Delivered'];
    let index = 0;

    const interval = setInterval(() => {
      if (index < statuses.length) {
        const nextStatus = statuses[index++];
        this.orderUpdates$.next({ orderId, status: nextStatus });
        sessionStorage.setItem(`order_status_${orderId}`, nextStatus);
      } else {
        clearInterval(interval);
        this.activeSimulations.delete(orderId);
      }
    }, 4000);
  }
}
