import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewMatchPage } from './new-match.page';

const routes: Routes = [
  {
    path: '',
    component: NewMatchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewMatchPageRoutingModule {}
