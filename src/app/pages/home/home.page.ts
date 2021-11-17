import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { DetailService } from 'src/app/services/detail.service';
import { SQLiteService } from 'src/app/services/sqlite.service';
import { InfoPage } from '../info/info.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public exConn: boolean;
  public exJson: boolean;
  public native: boolean = false;

  constructor(
    public navCtrl: NavController,
    private sqlite: SQLiteService,
    private detailService: DetailService,
    private modalCtrl: ModalController,
  ) {}

  ionViewWillEnter() {
    if(this.sqlite.platform === "android" || this.sqlite.platform === "ios") this.native = true;
    this.exConn = this.detailService.getExistingConnection();
    this.exJson = this.detailService.getExportJson();

  }

  async ionViewDidEnter() {
    // Deal with the secure secret if you need it
    // by using an input form
    // here i used a constant
    if(this.native) {
      const secretPhrase = 'abbey clammy gird night test';
      const isSet = await this.sqlite.isSecretStored()
      if(!isSet.result) {
        await this.sqlite.setEncryptionSecret(secretPhrase);
      }
    }
  }

  playersClick(){
    this.navCtrl.navigateForward('players');
  }

  matchClick() {
    this.navCtrl.navigateForward('matches');
  }

  async info() {
    const modal = await this.modalCtrl.create({
      component: InfoPage,
    });

    await modal.present();
  }
}
