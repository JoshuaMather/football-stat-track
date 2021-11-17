import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatchStatsPage } from './match-stats.page';

const routes: Routes = [
  {
    path: '',
    component: MatchStatsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchStatsPageRoutingModule {}
