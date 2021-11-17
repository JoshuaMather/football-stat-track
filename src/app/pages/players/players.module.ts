import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayersPageRoutingModule } from './players-routing.module';

import { PlayersPage } from './players.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlayersPageRoutingModule
  ],
  declarations: [PlayersPage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class PlayersPageModule {}
