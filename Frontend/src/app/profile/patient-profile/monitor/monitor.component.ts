import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { TextareaModule } from 'primeng/textarea';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { Subscription } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ECG, ECGDataPoint } from '../../../utils/ecg';
import { BloodPressureChart, BPDataPoint } from '../../../utils/bp';
import { MqttService } from '../../doctor-profile/mqtt.service';

@Component({
  selector: 'app-monitor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BadgeModule,
    TextareaModule,
    CardModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TooltipModule,
  ],
  templateUrl: './monitor.component.html',
  styleUrl: './monitor.component.css',
})
export class MonitorComponent implements OnInit, OnDestroy {
  @ViewChild('ecgSVG', { static: true }) ecgSvg!: ElementRef<SVGElement>;
  @ViewChild('bpSVG', { static: true }) bpSvg!: ElementRef<SVGElement>;

  private readonly margin = {
    top: 20,
    right: 0,
    bottom: 10,
    left: 60,
  };

  private mqtt = inject(MqttService);

  lead1!: ECG;
  bpChart!: BloodPressureChart;

  isLoadingLead1 = signal<boolean>(true);
  dataPointsReceivedECG = signal<number>(0);
  dataPointsReceivedBP = signal<[number, number] | null>(null);

  mqttConnected = toSignal(this.mqtt.mqttConnected$, { initialValue: false });
  ecgConnected = toSignal(this.mqtt.ecgConnected$, { initialValue: false });
  bpConnected = toSignal(this.mqtt.bpConnected$, { initialValue: false });

  private subs: Subscription[] = [];
  private ecgCounter = 0;

  ngOnInit() {
    console.log('Initializing Monitor Component with MQTT streaming...');

    this.lead1 = new ECG(this.ecgSvg.nativeElement, [], this.margin);
    this.bpChart = new BloodPressureChart(
      this.bpSvg.nativeElement,
      [],
      this.margin
    );

    const ecgSub = this.mqtt.ecgData$.subscribe({
      next: (point: ECGDataPoint) => {
        console.log('Received ECG point:', point);

        if (this.lead1?.isPlaying()) {
          this.lead1.addDataPoint(point);
        }

        this.ecgCounter++;
        this.dataPointsReceivedECG.set(this.ecgCounter);

        if (this.isLoadingLead1()) {
          this.isLoadingLead1.set(false);
        }
      },
      error: (err) => console.error('ECG stream error:', err),
    });
    this.subs.push(ecgSub);

    const bpSub = this.mqtt.bpData$.subscribe({
      next: (bp: BPDataPoint) => {
        console.log('🩺 Received BP point:', bp);

        // Add to BP chart if playing
        if (this.bpChart?.isPlaying()) {
          this.bpChart.addDataPoint(bp);
        }

        // Update latest BP reading
        this.dataPointsReceivedBP.set([bp.systolic, bp.diastolic]);
      },
      error: (err) => console.error('❌ BP stream error:', err),
    });
    this.subs.push(bpSub);
  }

  ngOnDestroy() {
    console.log('Cleaning up Monitor Component...');

    this.subs.forEach((sub) => sub.unsubscribe());

    this.lead1?.cleanup();
    this.bpChart?.cleanup();
  }

  toggleECGPlayback(): void {
    if (this.lead1) {
      const isPlaying = this.lead1.isPlaying();
      if (isPlaying) {
        (this.lead1 as any).pause?.();
      } else {
        (this.lead1 as any).play?.();
      }
    }
  }

  toggleBPPlayback(): void {
    if (this.bpChart) {
      const isPlaying = this.bpChart.isPlaying();
      if (isPlaying) {
        (this.bpChart as any).pause?.();
      } else {
        (this.bpChart as any).play?.();
      }
    }
  }

  clearCharts(): void {
    this.lead1?.clearChart();
    this.bpChart?.clearChart();
    this.ecgCounter = 0;
    this.dataPointsReceivedECG.set(0);
    this.dataPointsReceivedBP.set(null);
  }

  reconnectMQTT(): void {
    console.log('🔄 Reconnecting MQTT...');
    this.mqtt.disconnect();
  }
}
