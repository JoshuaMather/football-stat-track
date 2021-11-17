import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatsPage } from './stats.page';

const routes: Routes = [
  {
    path: '',
    component: StatsPage
  },
  {
    path: 'player-stats',
    loadChildren: () => import('./player-stats/player-stats.module').then( m => m.PlayerStatsPageModule)
  },
  {
    path: 'match-stats',
    loadChildren: () => import('./match-stats/match-stats.module').then( m => m.MatchStatsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatsPageRoutingModule {}
