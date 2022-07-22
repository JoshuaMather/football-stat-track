import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.page.html',
  styleUrls: ['./players.page.scss'],
})
export class PlayersPage implements OnInit {
  public playerList;

  constructor(
    private navCtrl: NavController,
    private db: DbService,
    public alertController: AlertController,
    public platform: Platform
  ) { }

  ngOnInit() {
    console.log(this.platform.platforms());
  }

  ionViewWillEnter() {
    this.loadPlayers();
  }

  async loadPlayers() {
    await this.db.getAllPlayers().then(res =>{
      this.playerList = res;
    });
  }

  home() {
    this.navCtrl.navigateBack('home');
  }

  statsClick(id: string, name: string) {
    this.db.getPlayerStats(id).then(res => {
      res = JSON.stringify(res);
      const navigationExtras: NavigationExtras = {
        queryParams: {
            name,
            stats: res
        }
      };
      this.navCtrl.navigateForward(['stats/player-stats'], navigationExtras);
    });
  }

  newPlayer() {
    this.navCtrl.navigateForward('new-player');
  }

  editPlayer(player) {
    let navigationExtras: NavigationExtras;
    // eslint-disable-next-line prefer-const
    navigationExtras = {
      queryParams: {
          id: player.playerId,
          name: player.name,
          position: player.position,
          dob: player.dob,
          email: player.email,
          phoneNumber: player.phoneNumber,
      }
    };
    this.navCtrl.navigateForward(['new-player'], navigationExtras);
    return;
  }

  async deletePlayer(playerId) {
    const deleteAlert = await this.alertController.create({
      header: 'Delete Player',
      message: 'Are you sure you want to delete this player?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (c) => {
            console.log('Delete cancelled');
          }
        }, {
          text: 'Confirm',
          handler: async () => {
            await this.db.deletePlayer(playerId);
            await this.loadPlayers();
          }
        }
      ]
    });

    await deleteAlert.present();
  }

  refresh(event) {
    setTimeout(() => {
      event.target.complete();
      this.loadPlayers();
    }, 2000);
  }

  async updateSubs(subs, playerId){
    await this.db.updateSubs(subs, playerId);
    await this.loadPlayers();
  }
}
