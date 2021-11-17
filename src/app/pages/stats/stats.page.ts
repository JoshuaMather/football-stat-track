import { Component, OnInit, ViewChild } from '@angular/core';
import { BarController, BarElement, CategoryScale, Chart, LinearScale, registerables } from 'chart.js';
Chart.register(BarController, BarElement, CategoryScale, LinearScale);
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage implements OnInit {
  @ViewChild('barChart') barChart;

  bars: any;

  public statsList; 
  public statSelect;
  public stat;
  public matches = 0;
  public goals = 0;
  public assists = 0;
  public saves = 0;

  constructor(
    private db: DbService
  ) { }

  ngOnInit() {
    this.db.getTotals().then(res => {
      this.matches = res[0];
      this.goals = res[1];
      this.assists = res[2];
      this.saves = res[3];
    })
  }

  async statSelected(stat) {
    this.stat = stat;
    this.statsList = await this.db.getLeaderboardStats(stat);
    this.createBarGraph();
  }

  createBarGraph() {
    if(this.bars) {
      this.bars.destroy();
    }
    
    let players = [];
    let stats = [];
    this.statsList.forEach(data => {
      players.push(data.name);
      stats.push(data[this.stat]);
    });
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: players,
        datasets: [{
          label: this.stat,
          data: stats,
          backgroundColor: 'rgb(0, 163, 19)', // array should have same number of elements as number of dataset
          borderColor: 'rgb(0, 163, 19)',// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
      }
    });
  }


}
