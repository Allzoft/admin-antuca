import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { Order } from '@interfaces/order';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable()
export class DailyMonitorSocket extends Socket {
  constructor() {
    const token: string | null = localStorage.getItem('token');
    super({
      url: environment.url_api + '/ws',
      options: {
        auth: { token: `Bearer ${token}` },
      },
    });
    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    this.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    this.on('message', (msg: any) => {
      console.log('Message received: ', msg);
    });

    this.on('error', (err: any) => {
      console.error('Error: ', err);
    });

    this.on('log', (err: any) => {
      console.log('log: ', err);
    });

    this.on('ordersList', (err: any) => {
      console.log('ordersList: ', err);
    });
  }

  public getNewOrder(): Observable<Order> {
    return this.fromEvent('newOrder');
  }

  public getUpdateOrder(): Observable<Order> {
    return this.fromEvent('updateOrder');
  }

  public getDeleteOrder(): Observable<Order> {
    return this.fromEvent('deleteOrder');
  }

  public getLog(): Observable<any> {
    return this.fromEvent('log');
  }

  public getError(): Observable<any> {
    return this.fromEvent('error');
  }

  public closeConnection(): void {
    this.disconnect();
  }
}
