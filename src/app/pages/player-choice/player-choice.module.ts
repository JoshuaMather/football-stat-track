import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayerChoicePageRoutingModule } from './player-choice-routing.module';

import { PlayerChoicePage } from './player-choice.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlayerChoicePageRoutingModule
  ],
  declarations: [PlayerChoicePage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class PlayerChoicePageModule {}
