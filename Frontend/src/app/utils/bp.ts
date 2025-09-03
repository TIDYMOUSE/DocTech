import { signal } from '@angular/core';
import * as d3 from 'd3';

export interface BPDataPoint {
  time: number;
  systolic: number;
  diastolic: number;
}

export interface BPMarker {
  id: string;
  time: number;
  systolic: number;
  diastolic: number;
  remark: string;
  x: number;
  y: number;
}

export class BloodPressureChart {
  // Chart properties
  private chartSvg: SVGElement;
  private svg!: d3.Selection<SVGElement, unknown, null, undefined>;
  private xScale: d3.ScaleLinear<number, number> | null = null;
  private yScale: d3.ScaleLinear<number, number> | null = null;
  private systolicLine: d3.Line<BPDataPoint> | null = null;
  private diastolicLine: d3.Line<BPDataPoint> | null = null;
  private systolicPath: d3.Selection<
    SVGPathElement,
    BPDataPoint[],
    null,
    undefined
  > | null = null;
  private diastolicPath: d3.Selection<
    SVGPathElement,
    BPDataPoint[],
    null,
    undefined
  > | null = null;
  private width: number = 1200;
  private height: number = 400;
  private margin: { top: number; right: number; bottom: number; left: number };

  // Streaming data properties
  private displayedData: BPDataPoint[] = [];
  private currentTime: number = 0;
  private lastUpdateTime: number = Date.now();
  private readonly timeWindowMs: number = 60000; // 1 minute visible window
  private readonly maxDataPoints: number = 1000;

  // Control properties
  public isPlaying = signal<boolean>(true);

  // Marker management
  private markers: BPMarker[] = [];
  public showMarkerDialog = signal<boolean>(false);
  public selectedMarker: BPMarker | null = null;
  public markerRemark: string = '';

  constructor(
    chartSVG: SVGElement,
    initialData: BPDataPoint[],
    margin: { left: number; right: number; top: number; bottom: number },
    width?: number,
    height?: number
  ) {
    this.chartSvg = chartSVG;
    this.margin = margin;
    if (width) this.width = width;
    if (height) this.height = height;

    this.displayedData = initialData.map((point, index) => ({
      ...point,
      time: index * 1000,
    }));

    this.init();
  }

  private init(): void {
    this.initializeChart();
    this.currentTime = 0;
    this.lastUpdateTime = Date.now();
  }

  private initializeChart(): void {
    d3.select(this.chartSvg).selectAll('*').remove();

    this.svg = d3
      .select(this.chartSvg)
      .attr('width', this.width)
      .attr('height', this.height);

    this.createScales();
    this.createAxes();
    this.createGrid();
    this.createLines();
    this.createLegend();

    // Add click handler for markers
    this.svg.on('click', (event: MouseEvent) => {
      if (this.displayedData.length > 0) {
        this.handleChartClick(event);
      }
    });
  }

  private createScales(): void {
    this.xScale = d3
      .scaleLinear()
      .domain([0, this.timeWindowMs])
      .range([this.margin.left, this.width - this.margin.right]);

    this.yScale = d3
      .scaleLinear()
      .domain([60, 180])
      .range([this.height - this.margin.bottom, this.margin.top]);
  }

  private createAxes(): void {
    if (!this.svg || !this.xScale || !this.yScale) return;

    this.svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${this.height - this.margin.bottom})`)
      .call(
        d3
          .axisBottom(this.xScale)
          .tickFormat((d) => `${((d as number) / 1000).toFixed(1)}s`)
          .tickSize(0)
          .tickPadding(8)
      )
      .style('color', 'white');

    this.svg
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${this.margin.left},0)`)
      .call(d3.axisLeft(this.yScale).tickFormat((d) => `${d}`))
      .style('color', 'white');
  }

  private createGrid(): void {
    if (!this.svg || !this.xScale || !this.yScale) return;

    const xGridLines = this.svg.append('g').attr('class', 'grid-x-line');
    const yGridLines = this.svg.append('g').attr('class', 'grid-y-line');

    this.renderGridLines(xGridLines, yGridLines);
  }

  private renderGridLines(xGridLines: any, yGridLines: any): void {
    if (!this.xScale || !this.yScale) return;

    // Vertical grid lines
    xGridLines
      .selectAll('line')
      .data(this.xScale.ticks(10))
      .enter()
      .append('line')
      .attr('class', 'bp-grid')
      .attr('x1', (d: number) => this.xScale!(d))
      .attr('x2', (d: number) => this.xScale!(d))
      .attr('y1', this.margin.top)
      .attr('y2', this.height - this.margin.bottom)
      .style('stroke', '#2a2a2a')
      .style('stroke-dasharray', '2 2');

    // Horizontal grid lines
    yGridLines
      .selectAll('line')
      .data(this.yScale.ticks(8))
      .enter()
      .append('line')
      .attr('class', 'bp-grid')
      .attr('x1', this.margin.left)
      .attr('x2', this.width - this.margin.right)
      .attr('y1', (d: number) => this.yScale!(d))
      .attr('y2', (d: number) => this.yScale!(d))
      .style('stroke', '#444444')
      .style('stroke-dasharray', '2 2');
  }

  private createLines(): void {
    if (!this.xScale || !this.yScale) return;

    this.systolicLine = d3
      .line<BPDataPoint>()
      .x((d) => this.xScale!(d.time))
      .y((d) => this.yScale!(d.systolic))
      .curve(d3.curveLinear);

    this.diastolicLine = d3
      .line<BPDataPoint>()
      .x((d) => this.xScale!(d.time))
      .y((d) => this.yScale!(d.diastolic))
      .curve(d3.curveLinear);

    this.systolicPath = this.svg
      .append('path')
      .datum(this.displayedData)
      .attr('d', this.systolicLine)
      .style('fill', 'none')
      .style('stroke-width', '2.5')
      .style('stroke', '#e91e63');

    this.diastolicPath = this.svg
      .append('path')
      .datum(this.displayedData)
      .attr('d', this.diastolicLine)
      .style('fill', 'none')
      .style('stroke-width', '2.5')
      .style('stroke', '#2196f3');
  }

  private createLegend(): void {
    if (!this.svg) return;

    const legend = this.svg.append('g').attr('class', 'legend');

    // Systolic legend
    legend
      .append('line')
      .attr('x1', this.width - 150)
      .attr('x2', this.width - 120)
      .attr('y1', 20)
      .attr('y2', 20)
      .style('stroke', '#e91e63')
      .style('stroke-width', '2.5');

    legend
      .append('text')
      .attr('x', this.width - 115)
      .attr('y', 25)
      .style('fill', 'white')
      .style('font-size', '12px')
      .text('Systolic');

    // Diastolic legend
    legend
      .append('line')
      .attr('x1', this.width - 150)
      .attr('x2', this.width - 120)
      .attr('y1', 40)
      .attr('y2', 40)
      .style('stroke', '#2196f3')
      .style('stroke-width', '2.5');

    legend
      .append('text')
      .attr('x', this.width - 115)
      .attr('y', 45)
      .style('fill', 'white')
      .style('font-size', '12px')
      .text('Diastolic');
  }

  // Main method for streaming data
  public addDataPoint(dataPoint: BPDataPoint): void {
    if (!this.isPlaying()) return;

    const now = Date.now();
    const timeDelta = now - this.lastUpdateTime;

    const newPoint: BPDataPoint = {
      time: this.currentTime,
      systolic: dataPoint.systolic,
      diastolic: dataPoint.diastolic,
    };

    this.displayedData.push(newPoint);

    // Manage data window
    const cutoffTime = this.currentTime - this.timeWindowMs;
    this.displayedData = this.displayedData.filter(
      (point) => point.time > cutoffTime
    );

    if (this.displayedData.length > this.maxDataPoints) {
      this.displayedData = this.displayedData.slice(-this.maxDataPoints);
    }

    this.updateChart();
    this.currentTime += timeDelta;
    this.lastUpdateTime = now;
  }

  private updateChart(): void {
    if (
      !this.xScale ||
      !this.yScale ||
      !this.systolicPath ||
      !this.diastolicPath ||
      !this.systolicLine ||
      !this.diastolicLine
    )
      return;

    const startTime = Math.max(0, this.currentTime - this.timeWindowMs);
    const endTime = Math.max(this.timeWindowMs, this.currentTime);

    this.xScale.domain([startTime, endTime]);

    this.systolicPath.datum(this.displayedData).attr('d', this.systolicLine);
    this.diastolicPath.datum(this.displayedData).attr('d', this.diastolicLine);

    this.updateAxes();
    this.updateMarkerPositions();
  }

  private updateAxes(): void {
    if (!this.svg || !this.xScale || !this.yScale) return;

    this.svg
      .select('.x-axis')
      .transition()
      .duration(50)
      .call(
        d3
          .axisBottom(this.xScale)
          .tickFormat((d) => `${((d as number) / 1000).toFixed(1)}s`)
          .tickSize(0)
          .tickPadding(8) as any
      );

    this.updateGrid();
  }

  private updateGrid(): void {
    if (!this.svg || !this.xScale || !this.yScale) return;

    const xGridLines = this.svg.select('.grid-x-line');
    const yGridLines = this.svg.select('.grid-y-line');

    xGridLines.selectAll('line').remove();
    yGridLines.selectAll('line').remove();

    this.renderGridLines(xGridLines, yGridLines);
  }

  private handleChartClick(event: MouseEvent): void {
    if (!this.xScale || !this.yScale || this.displayedData.length === 0) return;

    const rect = this.chartSvg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const time = this.xScale.invert(x);

    // Find closest data point
    let closestPoint = this.displayedData[0];
    let minDistance = Infinity;

    for (const point of this.displayedData) {
      const distance = Math.abs(point.time - time);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = point;
      }
    }

    if (closestPoint) {
      this.openMarkerDialog(closestPoint);
    }
  }

  private openMarkerDialog(dataPoint: BPDataPoint): void {
    this.selectedMarker = {
      id: Date.now().toString(),
      time: dataPoint.time,
      systolic: dataPoint.systolic,
      diastolic: dataPoint.diastolic,
      remark: '',
      x: this.xScale!(dataPoint.time),
      y: this.yScale!(dataPoint.systolic),
    };

    this.markerRemark = '';
    this.showMarkerDialog.set(true);
  }

  private updateMarkerPositions(): void {
    if (!this.svg || !this.xScale || !this.yScale) return;

    const cutoffTime = this.currentTime - this.timeWindowMs;
    const visibleMarkers = this.markers.filter(
      (m) => m.time > cutoffTime && m.time <= this.currentTime
    );

    const selection = this.svg
      .selectAll<SVGCircleElement, BPMarker>('circle.marker-point')
      .data(visibleMarkers, (d) => d.id);

    selection
      .enter()
      .append('circle')
      .attr('class', 'marker-point')
      .attr('r', 5)
      .attr('cx', (d) => this.xScale!(d.time))
      .attr('cy', (d) => this.yScale!(d.systolic))
      .style('fill', '#ff4444')
      .style('stroke', '#fff')
      .style('stroke-width', '2')
      .style('cursor', 'pointer')
      .on('click', (event: MouseEvent, d: BPMarker) => {
        event.stopPropagation();
        this.editMarker(d);
      });

    selection
      .attr('cx', (d) => this.xScale!(d.time))
      .attr('cy', (d) => this.yScale!(d.systolic));

    selection.exit().remove();

    this.markers = visibleMarkers;
  }

  // Public API for markers
  public getMarkers(): BPMarker[] {
    return [...this.markers];
  }

  public editMarker(marker: BPMarker): void {
    this.selectedMarker = { ...marker };
    this.markerRemark = marker.remark;
    this.showMarkerDialog.set(true);
  }

  public saveMarker(): void {
    if (!this.selectedMarker) return;

    const existingIndex = this.markers.findIndex(
      (m) => m.id === this.selectedMarker!.id
    );

    if (existingIndex >= 0) {
      this.markers[existingIndex] = {
        ...this.selectedMarker,
        remark: this.markerRemark,
      };
    } else {
      this.markers.push({
        ...this.selectedMarker,
        remark: this.markerRemark,
      });
    }

    this.closeMarkerDialog();
    this.updateMarkerPositions();
  }

  public removeMarker(id: string): void {
    this.markers = this.markers.filter((m) => m.id !== id);
    this.updateMarkerPositions();
  }

  public clearMarkers(): void {
    this.markers = [];
    this.updateMarkerPositions();
  }

  private closeMarkerDialog(): void {
    this.showMarkerDialog.set(false);
    this.selectedMarker = null;
    this.markerRemark = '';
  }

  public togglePlayPause(): void {
    this.isPlaying.update((v) => !v);
  }

  public clearChart(): void {
    this.displayedData = [];
    this.currentTime = 0;
    this.lastUpdateTime = Date.now();
    this.markers = [];

    if (
      this.systolicPath &&
      this.diastolicPath &&
      this.systolicLine &&
      this.diastolicLine
    ) {
      this.systolicPath.datum(this.displayedData).attr('d', this.systolicLine);
      this.diastolicPath
        .datum(this.displayedData)
        .attr('d', this.diastolicLine);
    }

    this.updateMarkerPositions();
  }

  public formatTime(time: number): string {
    return `${(time / 1000).toFixed(2)}s`;
  }

  public cleanup(): void {
    this.displayedData = [];
    this.markers = [];
    this.closeMarkerDialog();
  }

  public cancelMarkerEdit(): void {
    this.closeMarkerDialog();
  }
}
