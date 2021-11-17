import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewPlayerPageRoutingModule } from './new-player-routing.module';

import { NewPlayerPage } from './new-player.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewPlayerPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [NewPlayerPage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class NewPlayerPageModule {}
