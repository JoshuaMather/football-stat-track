import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewMatchPageRoutingModule } from './new-match-routing.module';

import { NewMatchPage } from './new-match.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewMatchPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [NewMatchPage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class NewMatchPageModule {}
