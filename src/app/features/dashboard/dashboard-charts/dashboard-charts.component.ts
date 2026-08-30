import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import {
  LeadStatusChartResponse
} from '../../../core/models/lead-status-chart-response';

import {
  LeadPriorityChartResponse
} from '../../../core/models/lead-priority-chart-response';

import {
  LeadSourceChartResponse
} from '../../../core/models/lead-source-chart-response';

import {
  MonthlyLeadChartResponse
} from '../../../core/models/monthly-lead-chart-response';


@Component({
  selector: 'app-dashboard-charts',
  templateUrl: './dashboard-charts.component.html',
  styleUrls: ['./dashboard-charts.component.css']
})
export class DashboardChartsComponent
  implements OnChanges {


  @Input()
  leadStatus: LeadStatusChartResponse[] = [];


  @Input()
  leadPriority: LeadPriorityChartResponse[] = [];


  @Input()
  leadSource: LeadSourceChartResponse[] = [];


  @Input()
  monthlyLeads: MonthlyLeadChartResponse[] = [];


  /* ==========================================================
     STATUS
  ========================================================== */

  statusTotal = 0;

  statusSegments: any[] = [];


  /* ==========================================================
     PRIORITY
  ========================================================== */

  priorityTotal = 0;

  prioritySegments: any[] = [];


  /* ==========================================================
     SOURCE
  ========================================================== */

  sourceTotal = 0;

  sourceSegments: any[] = [];


  /* ==========================================================
     MONTHLY
  ========================================================== */

  monthlyMaximum = 1;


  ngOnChanges(
    changes: SimpleChanges
  ): void {

    this.prepareStatusChart();

    this.preparePriorityChart();

    this.prepareSourceChart();

    this.prepareMonthlyChart();

  }


  /* ==========================================================
     STATUS CHART
  ========================================================== */

  prepareStatusChart(): void {

    this.statusTotal = this.getTotal(
      this.leadStatus
    );


    let currentAngle = 0;


    this.statusSegments =
      this.leadStatus.map(
        (item, index) => {

          const count =
            Number(item.count) || 0;


          const percentage =
            this.statusTotal > 0
              ? (count / this.statusTotal) * 100
              : 0;


          const start =
            currentAngle;


          const end =
            currentAngle +
            (percentage * 3.6);


          currentAngle = end;


          return {

            label:
              this.formatEnum(
                item.status
              ),

            count,

            percentage,

            start,

            end,

            color:
              this.getChartColor(index)

          };

        }
      );

  }


  /* ==========================================================
     PRIORITY CHART
  ========================================================== */

  preparePriorityChart(): void {

    this.priorityTotal = this.getTotal(
      this.leadPriority
    );


    let currentAngle = 0;


    this.prioritySegments =
      this.leadPriority.map(
        (item, index) => {

          const count =
            Number(item.count) || 0;


          const percentage =
            this.priorityTotal > 0
              ? (count / this.priorityTotal) * 100
              : 0;


          const start =
            currentAngle;


          const end =
            currentAngle +
            (percentage * 3.6);


          currentAngle = end;


          return {

            label:
              this.formatEnum(
                item.priority
              ),

            count,

            percentage,

            start,

            end,

            color:
              this.getChartColor(
                index + 2
              )

          };

        }
      );

  }


  /* ==========================================================
     SOURCE CHART
  ========================================================== */

  prepareSourceChart(): void {

    this.sourceTotal = this.getTotal(
      this.leadSource
    );


    let currentAngle = 0;


    this.sourceSegments =
      this.leadSource.map(
        (item, index) => {

          const count =
            Number(item.count) || 0;


          const percentage =
            this.sourceTotal > 0
              ? (count / this.sourceTotal) * 100
              : 0;


          const start =
            currentAngle;


          const end =
            currentAngle +
            (percentage * 3.6);


          currentAngle = end;


          return {

            label:
              item.source || 'Unknown',

            count,

            percentage,

            start,

            end,

            color:
              this.getChartColor(
                index + 4
              )

          };

        }
      );

  }


  /* ==========================================================
     MONTHLY CHART
  ========================================================== */

  prepareMonthlyChart(): void {

    if (
      !this.monthlyLeads ||
      this.monthlyLeads.length === 0
    ) {

      this.monthlyMaximum = 1;

      return;

    }


    const values =
      this.monthlyLeads.map(
        item =>
          Number(item.count) || 0
      );


    this.monthlyMaximum =
      Math.max(...values);


    if (this.monthlyMaximum <= 0) {

      this.monthlyMaximum = 1;

    }

  }


  /* ==========================================================
     TOTAL
  ========================================================== */

  getTotal(items: any[]): number {

    if (
      !items ||
      items.length === 0
    ) {

      return 0;

    }


    return items.reduce(
      (
        total,
        item
      ) => {

        return total +
          (Number(item.count) || 0);

      },
      0
    );

  }


  /* ==========================================================
     DONUT STYLE
  ========================================================== */

  getDonutStyle(
    segments: any[]
  ): any {

    if (
      !segments ||
      segments.length === 0
    ) {

      return {
        background:
          '#edf0f7'
      };

    }


    const gradient =
      segments
        .map(
          segment =>
            `${segment.color} ${segment.start}deg ${segment.end}deg`
        )
        .join(', ');


    return {

      background:
        `conic-gradient(${gradient})`

    };

  }


  /* ==========================================================
     MONTH BAR HEIGHT
  ========================================================== */

  getBarHeight(
    count: number
  ): number {

    if (!this.monthlyMaximum) {

      return 0;

    }


    return Math.max(
      5,
      (Number(count) /
        this.monthlyMaximum) * 100
    );

  }


  /* ==========================================================
     CHART COLOR
  ========================================================== */

  getChartColor(
    index: number
  ): string {

    const colors = [

      '#6546d7',

      '#16b8d4',

      '#3772ff',

      '#8b5cf6',

      '#14b87a',

      '#f59e0b',

      '#ef5b67',

      '#e34d8f',

      '#00a6a6',

      '#7c3aed'

    ];


    return colors[
      index % colors.length
    ];

  }


  /* ==========================================================
     ENUM FORMAT
  ========================================================== */

  formatEnum(
    value: any
  ): string {

    if (!value) {

      return '';

    }


    return String(value)
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(
        /\b\w/g,
        char =>
          char.toUpperCase()
      );

  }


  /* ==========================================================
     TRACK BY
  ========================================================== */

  trackByIndex(
    index: number
  ): number {

    return index;

  }

}