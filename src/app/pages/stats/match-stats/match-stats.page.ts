import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-match-stats',
  templateUrl: './match-stats.page.html',
  styleUrls: ['./match-stats.page.scss'],
})
export class MatchStatsPage implements OnInit {

  public matchId;
  public maxBreadcrumbs = 2;
  public matchInfo;

  public date;
  public finish;
  public bs;
  public nbs;

  public bibs;
  public nonBibs;
  
  public matchRatingName;
  public matchRatingStat;
  public goalsName;
  public goalsStat;
  public assistsName;
  public assistsStat;
  public savesName;
  public savesStat;
  public workrateName;
  public workrateStat;
  public defRatingName;
  public defRatingStat;
  public attRatingName;
  public attRatingStat;

  constructor(
    private route: ActivatedRoute,
    private db: DbService,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.matchId = params.matchId;
    });
  }

  async ionViewWillEnter() {
    await this.loadMatchData();
    await this.loadTeams();
  }

  async loadMatchData() {
    await this.db.getMatchInfo(this.matchId).then(res => {
      this.matchInfo = res;
      this.date = res.matchDate;
      this.finish = res.matchFinishTime;
      this.bs = res.bibsScore;
      this.nbs = res.nonBibsScore;
      console.log(this.matchInfo);
    });

    await this.db.getMatchTopStats(this.matchId).then(res => {
      this.matchRatingName = res[0].name;
      this.matchRatingStat = res[0]['MAX(matchRating)'];
      this.goalsName = res[1].name;
      this.goalsStat = res[1]['MAX(goals)'];
      this.assistsName = res[2].name;
      this.assistsStat = res[2]['MAX(assists)'];
      this.savesName = res[3].name;
      this.savesStat = res[3]['MAX(saves)'];
      this.workrateName = res[4].name;
      this.workrateStat = res[4]['MAX(workrate)'];
      this.defRatingName = res[5].name;
      this.defRatingStat = res[5]['MAX(defRating)'];
      this.attRatingName = res[6].name;
      this.attRatingStat = res[6]['MAX(attRating)'];
    });

  }

  async loadTeams() {
    await this.db.getTeam('bibsTable', this.matchId).then(res => {
      this.bibs = res;
    });

    await this.db.getTeam('nonBibsTable', this.matchId).then(res => {
      this.nonBibs = res;
    });
  }

  expandBreadcrumbs() {
    this.maxBreadcrumbs = 3;
  }

}
