import { Injectable } from '@angular/core';
import mqtt from 'mqtt';
import { environment } from '../../../environments/environment.development';
import { Subject, BehaviorSubject } from 'rxjs';
import { ECG, ECGDataPoint } from '../../utils/ecg';
import { BPDataPoint } from '../../utils/bp';

@Injectable({
  providedIn: 'root',
})
export class MqttService {
  private client: mqtt.MqttClient;

  private mqttConnectionStatus = new BehaviorSubject<boolean>(false);
  private ecgConnectionStatus = new BehaviorSubject<boolean>(false);
  private bpConnectionStatus = new BehaviorSubject<boolean>(false);

  private ecgSubject = new Subject<ECGDataPoint>();
  private bpSubject = new Subject<BPDataPoint>();

  public ecgData$ = this.ecgSubject.asObservable();
  public bpData$ = this.bpSubject.asObservable();

  public mqttConnected$ = this.mqttConnectionStatus.asObservable();
  public ecgConnected$ = this.ecgConnectionStatus.asObservable();
  public bpConnected$ = this.bpConnectionStatus.asObservable();

  private ecgLastReceived: number = 0;
  private bpLastReceived: number = 0;
  private readonly CONNECTION_TIMEOUT = 10000;

  constructor() {
    console.log('🔌 Connecting to MQTT broker for ECG data...');
    const options: mqtt.IClientOptions = {
      host: 'localhost',
      port: 9091,
      protocol: 'ws',
      username: environment.username,
      password: environment.password,
      clientId: 'Monitor',
    };
    this.client = mqtt.connect(options);

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.mqttConnectionStatus.next(true);
      this.subscribeToECGTopic();
      this.subscribeToBpTopic();
      this.startConnectionMonitoring();
    });

    this.client.on('message', (topic, message) => {
      if (topic === 'monitor/ecg1') {
        this.processECGMessage(message.toString());
      } else if (topic === 'monitor/bp') {
        this.processBPMessage(message.toString());
      }
    });

    this.client.on('error', (error) => {
      console.error('MQTT Error:', error);
      this.mqttConnectionStatus.next(false);
      this.ecgConnectionStatus.next(false);
      this.bpConnectionStatus.next(false);
    });

    this.client.on('offline', () => {
      console.warn('MQTT went offline');
      this.mqttConnectionStatus.next(false);
      this.ecgConnectionStatus.next(false);
      this.bpConnectionStatus.next(false);
    });
  }

  private subscribeToECGTopic() {
    this.client.subscribe('monitor/ecg1', (err) => {
      if (err) {
        console.error('Failed to subscribe to ECG topic:', err);
        this.ecgConnectionStatus.next(false);
      } else {
        console.log('Subscribed to monitor/ecg1 topic');
      }
    });
  }

  private subscribeToBpTopic() {
    this.client.subscribe('monitor/bp', (err) => {
      if (err) {
        console.error('Failed to subscribe to BP topic:', err);
        this.bpConnectionStatus.next(false);
      } else {
        console.log('Subscribed to monitor/bp topic');
      }
    });
  }

  private processECGMessage(message: string): void {
    try {
      const data: ECGDataPoint = JSON.parse(message);
      console.log('ECG data received:', data);

      this.ecgLastReceived = Date.now();
      this.ecgConnectionStatus.next(true);

      this.ecgSubject.next(data);
    } catch (error) {
      console.error('Error parsing MQTT ECG data:', error);
      this.ecgConnectionStatus.next(false);
    }
  }

  private processBPMessage(message: string): void {
    try {
      const data: BPDataPoint = JSON.parse(message);
      console.log('BP data received:', data);
      this.bpLastReceived = Date.now();
      this.bpConnectionStatus.next(true);

      this.bpSubject.next(data);
    } catch (error) {
      console.error(' Error parsing MQTT BP data:', error);
      this.bpConnectionStatus.next(false);
    }
  }

  /**
   * Monitor connection status based on data flow
   * If no data received for CONNECTION_TIMEOUT, mark as disconnected
   */
  private startConnectionMonitoring(): void {
    setInterval(() => {
      const now = Date.now();

      if (
        this.ecgLastReceived > 0 &&
        now - this.ecgLastReceived > this.CONNECTION_TIMEOUT
      ) {
        console.warn(' ECG data stream timeout - no data for 10 seconds');
        this.ecgConnectionStatus.next(false);
      }

      if (
        this.bpLastReceived > 0 &&
        now - this.bpLastReceived > this.CONNECTION_TIMEOUT
      ) {
        console.warn(' BP data stream timeout - no data for 10 seconds');
        this.bpConnectionStatus.next(false);
      }
    }, 5000);
  }

  disconnect(): void {
    if (this.client) {
      this.client.end();
      this.mqttConnectionStatus.next(false);
      this.ecgConnectionStatus.next(false);
      this.bpConnectionStatus.next(false);
    }
  }

  isECGConnected(): boolean {
    return this.ecgConnectionStatus.value;
  }

  isBPConnected(): boolean {
    return this.bpConnectionStatus.value;
  }

  isMQTTConnected(): boolean {
    return this.mqttConnectionStatus.value;
  }
}
