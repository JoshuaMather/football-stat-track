import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchStatsPageRoutingModule } from './match-stats-routing.module';

import { MatchStatsPage } from './match-stats.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatchStatsPageRoutingModule
  ],
  declarations: [MatchStatsPage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class MatchStatsPageModule {}
