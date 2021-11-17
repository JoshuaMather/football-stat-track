import { Component } from '@angular/core';

import { NavController, Platform } from '@ionic/angular';
import { SQLiteService } from './services/sqlite.service';
import { DetailService } from './services/detail.service';
import { Capacitor } from '@capacitor/core';
import { DbService } from './services/db.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  private initPlugin: boolean;
  public isWeb: boolean = false;
  constructor(
    private platform: Platform,
    private sqlite: SQLiteService,
    private detail: DetailService,
    private navCtrl: NavController,
    private db: DbService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.navCtrl.navigateForward('home');

    this.platform.ready().then(async () => {
      this.detail.setExistingConnection(false);
      this.detail.setExportJson(false);
      this.sqlite.initializePlugin().then(async (ret) => {
        this.initPlugin = ret;
        const p: string = this.sqlite.platform;
        console.log(`plaform ${p}`);
        if( p === "web") {
          this.isWeb = true;
          await customElements.whenDefined('jeep-sqlite');
          const jeepSqliteEl = document.querySelector('jeep-sqlite');
          if(jeepSqliteEl != null) {
            await this.sqlite.initWebStore();

            console.log(`isStoreOpen ${await jeepSqliteEl.isStoreOpen()}`)
            console.log(`$$ jeepSqliteEl is defined}`);
          } else {
            console.log('$$ jeepSqliteEl is null');
          }
        }

        console.log(">>>> in App  this.initPlugin " + this.initPlugin)
        this.db.createTables();
      });
    });
  }

}
