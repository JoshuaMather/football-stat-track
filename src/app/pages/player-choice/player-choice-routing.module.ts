import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayerChoicePage } from './player-choice.page';

const routes: Routes = [
  {
    path: '',
    component: PlayerChoicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerChoicePageRoutingModule {}
