import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PopoverController } from "@ionic/angular";
import { PopoverComponent } from "src/app/components/popover/popover.component";
import {
  CategoryScale,
  Chart,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  RadarController,
  RadialLinearScale,
  registerables,
} from "chart.js";
import { DbService } from "src/app/services/db.service";
Chart.register(
  CategoryScale,
  LinearScale,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineController,
  LineElement
);

@Component({
  selector: "app-player-stats",
  templateUrl: "./player-stats.page.html",
  styleUrls: ["./player-stats.page.scss"],
})
export class PlayerStatsPage implements OnInit {
  @ViewChild("radarChart") radarChart;

  radar: any;

  public name: string;
  public stats;
  public averages  = [];

  constructor(
    private route: ActivatedRoute,
    public popoverController: PopoverController,
    private db: DbService
  ) {}

  async ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.name = params.name;
      this.stats = JSON.parse(params.stats);
      // this.stats = params.stats;
    });

    await this.db.getAverageStats().then(res => {
      this.averages = Object.values(res);
    });

    this.createRadarGraph();
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      componentProps: {
        collapsedBreadcrumbs: ev.detail.collapsedBreadcrumbs,
      },
      event: ev,
    });
    await popover.present();
  }

  createRadarGraph() {
    if (this.radar) {
      this.radar.destroy();
    }
    
    // this.radar = new Chart(this.radarChart.nativeElement, {
      // type: "radar",
      const statsData = {
        labels: [
          "Rating",
          "Goals",
          "Assists",
          "Saves",
          "Workrate",
          "Defensive Rating",
          "Attacking Rating",
        ],
        datasets: [
          {
            label: "Player Average",
            data: [
              this.stats.averageRating,
              this.stats.averageGoals,
              this.stats.averageAssists,
              this.stats.averageSaves,
              this.stats.averageWorkrate,
              this.stats.averageDefRating,
              this.stats.averageAttRating,
            ],
            fill: 0,
            backgroundColor: "rgb(0, 163, 19)",
            borderColor: "rgb(0, 163, 19)",
            pointBackgroundColor: "rgb(0, 163, 19)",
            pointHoverBorderColor: "rgb(0, 163, 19)",
          },
          {
            label: "Overall Average",
            data: this.averages,
            fill: false,
            backgroundColor: "rgb(117, 117, 117)",
            borderColor: "rgb(117, 117, 117)",
            pointBackgroundColor: "rgb(117, 117, 117)",
            pointHoverBorderColor: "rgb(117, 117, 117)",
          }
        ],
      };
      
      // TODO: Legend not working
      const statsOptions = {
        plugins: {
          legend: {
            display: true,
            position: 'top' as 'top',
            align: 'start' as 'start'
          }
        },
        scales: {
          r: {
              angleLines: {
                  display: false
              },
              suggestedMin: 0,
          }
      },
        elements: {
          line: {
            borderWidth: 3,
          },
        },
        };      

    this.radarChart = new Chart(this.radarChart.nativeElement, {
      type: 'radar',
      data: statsData,
      options: statsOptions
    });
  }
}
