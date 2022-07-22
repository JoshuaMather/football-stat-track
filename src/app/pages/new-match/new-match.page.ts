import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonDatetime, ModalController, NavController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { DbService } from 'src/app/services/db.service';
import { PlayerChoicePage } from '../player-choice/player-choice.page';

@Component({
  selector: 'app-new-match',
  templateUrl: './new-match.page.html',
  styleUrls: ['./new-match.page.scss'],
})
export class NewMatchPage implements OnInit {

  @ViewChild('popoverDatetime', { read: ElementRef }) datetime: IonDatetime;

  public createMatch: FormGroup;
  public dateValue = '';
  public timeValue = '';
  public today;
  public bibsScore;
  public nonBibsScore;
  public id;
  public edit = false;
  public loading = false;

  public bibs = [];
  public nonBibs = [];
  public players;
  public selectedPlayers;

  public playerStatsArray = [];

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private db: DbService,
    private alertController: AlertController,
    private route: ActivatedRoute,
  ) {
    this.createMatch = this.formBuilder.group({
      // Validators.required
      date: [''],
      bibScore: [''],
      nonBibScore: [''],
      finishTime: [''],
    });
  }

  async ngOnInit() {
    this.loading = true;
    this.createMatch.reset();
    const date = new Date();
    this.today = date.toISOString();

    this.players = await this.db.getAllPlayers();
    this.bibs = [];
    this.nonBibs = [];

    await this.route.queryParams.subscribe(params => {
      this.id = params.matchId;
      if(this.id) {
        this.edit = true;
      }
    });

    if(this.edit && this.id){
      // get match details
      await this.db.getMatchInfo(this.id).then(res => {
        this.dateValue = res.matchDate;
        this.timeValue = res.matchFinishTime;
        this.bibsScore = res.bibsScore;
        this.nonBibsScore = res.nonBibsScore;
      });

      await this.db.getTeam('bibsTable', this.id).then(res => {
        this.bibs = res;
      });
      await this.db.getTeam('nonBibsTable', this.id).then(res => {
        this.nonBibs = res;
      });

      this.selectedPlayers = [...this.bibs, ...this.nonBibs];

      this.db.getMatchPlayerStats(this.id).then(res => {
        this.playerStatsArray = res;
      })
    }
    this.loading = false;
  }

  formatDate(value: string) {
    if(value) {
      return format(parseISO(value), 'MMM dd yyyy HH:mm');
    }
    return '';
  }

  formatTime(value: string) {
    if(value) {
      return format(parseISO(value), 'HH:mm');
    }
    return '';
  }


  async choosePlayers(team) {
    // let playersAvailable = this.players;
    let playersSelected = [];
    let playersUnavailable = [];

    if(team==='bibs'){
      // playersAvailable.filter(x => !this.nonBibs.includes(x));
      playersSelected = this.bibs;
      playersUnavailable = this.nonBibs;
    } else {
      // playersAvailable.filter(x => !this.bibs.includes(x));
      playersSelected = this.nonBibs;
      playersUnavailable = this.bibs;
    }
    console.log(playersSelected);
    console.log(playersUnavailable);

    this.modalCtrl.getTop().then(async res => {
      if(!res){
        const modal = await this.modalCtrl.create({
          component: PlayerChoicePage,
          componentProps: {
            players: this.players,
            selected: playersSelected,
            unavailable: playersUnavailable
          },
          initialBreakpoint: 0.5,
          breakpoints: [0, 0.25, 0.5, 0.75, 1],
          backdropBreakpoint: 0.5,
        });

        modal.onDidDismiss().then(data => {
          if(team==='bibs'){
            this.bibs = data['data'];
          } else {
            this.nonBibs = data['data'];
          }
          this.selectedPlayers = [...this.bibs, ...this.nonBibs];

          let newPlayerStatsArray = [];
          this.selectedPlayers.forEach(player => {
            console.log(this.selectedPlayers, this.playerStatsArray);
            let index = this.playerStatsArray.findIndex(x => x.playerId === player.playerId);
            if(index===-1) {
              let playerStats: { playerId: number; goals: number; assists: number; saves: number; workrate: number; defRating: number; attRating: number; matchRating: number; } = 
                { playerId: player.playerId, goals: 0, assists: 0, saves: 0, workrate: 0, defRating: 0, attRating: 0, matchRating: 0 };
              newPlayerStatsArray.push(playerStats);
            } else {
              newPlayerStatsArray.push(this.playerStatsArray[index]);
            }
          });
          this.playerStatsArray = newPlayerStatsArray;
          this.updateMatchRatings();
          // console.log(this.playerStatsArray);
        })

        return await modal.present();
      }
    });
  }

  modalClose() {
    this.modalCtrl.getTop().then(async res => {
      if(res){
        this.modalCtrl.dismiss();
      }
    });
  }

  async createAlert() {
    const createAlert = await this.alertController.create({
      header: 'Create Match',
      message: 'Are you sure you want to create a match with these details? \n Note: These can all be edited later.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (c) => {
            console.log('Create cancelled');
          }
        }, {
          text: 'Confirm',
          handler: async () => {
            await this.create();
          }
        }
      ]
    });

    await createAlert.present();
  }

  async create() {
    const matchId = await this.db.addMatch(this.dateValue, this.timeValue, 
     this.createMatch.get('bibScore').value, this.createMatch.get('nonBibScore').value);

    // create teams entry
    await this.db.addTeams(this.bibs, this.nonBibs, matchId.changes.lastId);

    // create player match stats entry
    await this.db.addMatchPlayerStats(this.playerStatsArray, matchId.changes.lastId);

    this.navCtrl.navigateForward('matches');
  }

  updatePlayerStatsArray(id, event, stat) {
      // update stat in map
      let index = this.playerStatsArray.findIndex(x => x.playerId === id);
      this.playerStatsArray[index][stat] = Number(event.detail.value);
  
      // calculate match rating and update in app
      this.updateMatchRatings();
  }

  updateMatchRatings() {
    let bibsGoals = 0;
    let bibsAssists = 0;
    let bibsSaves = 0;
    let nonBibsGoals = 0;
    let nonBibsAssists = 0;
    let nonBibsSaves = 0;

    this.playerStatsArray.forEach(playerStats => {
      if(this.bibs.findIndex(p => p.playerId===playerStats.playerId)===-1){
        nonBibsGoals += playerStats.goals;
        nonBibsAssists += playerStats.assists;
        nonBibsSaves += playerStats.saves;
      } else {
        bibsGoals += playerStats.goals;
        bibsAssists += playerStats.assists;
        bibsSaves += playerStats.saves;
      }
    });

    this.playerStatsArray.forEach(playerStats => {
      if(this.bibs.findIndex(p => p.playerId===playerStats.playerId)===-1) {
        let rating = ((playerStats.workrate + playerStats.defRating + playerStats.attRating) +
           ((nonBibsGoals===0) ? 0 : (playerStats.goals/nonBibsGoals)*10) + ((nonBibsAssists===0) ? 0 : (playerStats.assists/nonBibsAssists)*10) + ((nonBibsSaves===0) ? 0 : (playerStats.saves/nonBibsSaves)*10)) / 6;
        playerStats.matchRating = rating.toFixed(2);
      } else {
        let rating = ((playerStats.workrate + playerStats.defRating + playerStats.attRating) +
           ((bibsGoals===0) ? 0 : (playerStats.goals/bibsGoals)*10) + ((bibsAssists===0) ? 0 : (playerStats.assists/bibsAssists)*10) + ((bibsSaves===0) ? 0 : (playerStats.saves/bibsSaves)*10)) / 6;
        playerStats.matchRating = rating.toFixed(2);
      }
    });
  }

  index(id) {
    let index = this.playerStatsArray.findIndex(x => x.playerId === id);
    return index;
  }

  async editAlert() {
    const editAlert = await this.alertController.create({
      header: 'Edit Match',
      message: 'Are you sure you want to edit this match with these details?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (c) => {
            console.log('Edit cancelled');
          }
        }, {
          text: 'Confirm',
          handler: async () => {
            await this.editMatch();
          }
        }
      ]
    });

    await editAlert.present();
  }

  async editMatch() {
    await this.db.editMatchInfo(this.dateValue, this.timeValue, 
      this.createMatch.get('bibScore').value, this.createMatch.get('nonBibScore').value, this.id);
 
     // create teams entry
     await this.db.editTeams(this.bibs, this.nonBibs, this.id);
 
     // create player match stats entry
     await this.db.editMatchPlayerStats(this.playerStatsArray, this.id);
 
     this.navCtrl.navigateForward('matches');
  }
}
