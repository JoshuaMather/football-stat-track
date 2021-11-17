import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'players',
    loadChildren: () => import('./pages/players/players.module').then( m => m.PlayersPageModule)
  },
  {
    path: 'stats',
    loadChildren: () => import('./pages/stats/stats.module').then( m => m.StatsPageModule)
  },
  {
    path: 'matches',
    loadChildren: () => import('./pages/matches/matches.module').then( m => m.MatchesPageModule)
  },
  {
    path: 'new-match',
    loadChildren: () => import('./pages/new-match/new-match.module').then( m => m.NewMatchPageModule)
  },
  {
    path: 'new-player',
    loadChildren: () => import('./pages/new-player/new-player.module').then( m => m.NewPlayerPageModule)
  },
  {
    path: 'player-choice',
    loadChildren: () => import('./pages/player-choice/player-choice.module').then( m => m.PlayerChoicePageModule)
  },
  {
    path: 'info',
    loadChildren: () => import('./pages/info/info.module').then( m => m.InfoPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
