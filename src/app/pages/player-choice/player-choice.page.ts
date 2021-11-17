import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-player-choice',
  templateUrl: './player-choice.page.html',
  styleUrls: ['./player-choice.page.scss'],
})
export class PlayerChoicePage implements OnInit {
  players;
  selected;
  unavailable;
  public teamChoice = [];
  public checked = [];
  public disabled = [];

  public statsList; 
  public statSelect;
  public stat;

  constructor(
    private modalCtrl: ModalController,
    private db: DbService
  ) { }

  ngOnInit() {
    this.selected.forEach(p => {
      this.teamChoice.push(p);
    });
  }

  confirm() {
    this.modalCtrl.dismiss(this.teamChoice);
  }

  checkPlayerStat(playerStat) {
    const player = this.players.find(p => p.playerId === playerStat.playerId);
    this.checkPlayer(player);
  }

  checkPlayer(player) {
    if(!this.teamChoice.find(element => element.playerId === player.playerId)){
      this.teamChoice.push(player);
    } else {
      const removed = this.teamChoice.splice(this.teamChoice.indexOf(player), 1);
      console.log("removed", removed);
    }
  }

  playerSelected(player) {
    if(this.selected.findIndex(x => x.playerId === player.playerId)===-1){
      return false;
    }
    return true;
  }

  playerUnavailable(player) {
    if(this.unavailable.findIndex(x => x.playerId === player.playerId)===-1){
      return false;
    }
    return true;
  }

  async statSelected(stat) {
    if(stat!=='none') {
      this.stat = stat;
      this.statsList = await this.db.getLeaderboardStats(stat);
    } else {
      this.statsList = null;
    }
  }
}
