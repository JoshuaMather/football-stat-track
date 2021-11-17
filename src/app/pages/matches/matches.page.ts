import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.page.html',
  styleUrls: ['./matches.page.scss'],
})
export class MatchesPage implements OnInit {
  public matchesList;

  constructor(
    public navCtrl: NavController,
    private db: DbService,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loadMatches();
  }

  async loadMatches() {
    this.db.getMatches().then(res =>{
      this.matchesList = res;
    });
  }

  statsClick(matchId) {
    let navigationExtras: NavigationExtras;
      navigationExtras = {
        queryParams: {
          matchId
        }
      };
      this.navCtrl.navigateForward(['stats/match-stats'], navigationExtras);
  }

  newMatch() {
    this.navCtrl.navigateForward('new-match');
  }

  leaderboardClick() {
    this.navCtrl.navigateForward('stats');
  }

  async deleteMatch(matchId) {
    const deleteAlert = await this.alertController.create({
      header: 'Delete Match',
      message: 'Are you sure you want to delete this match?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (c) => {
            console.log('Delete cancelled');
          }
        }, {
          text: 'Comfirm',
          handler: async () => {
            await this.db.deleteMatch(matchId);
            await this.loadMatches();
          }
        }
      ]
    });

    await deleteAlert.present();
  }

  editMatch(matchId) {
    let navigationExtras: NavigationExtras;
    // eslint-disable-next-line prefer-const
    navigationExtras = {
      queryParams: {
          matchId
      }
    };
    this.navCtrl.navigateForward(['new-match'], navigationExtras);
  }

}
