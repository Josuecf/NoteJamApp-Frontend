import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { FoldersPage } from './folders.page';

import { FoldersPageRoutingModule } from './folders-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FoldersPageRoutingModule
  ],
  declarations: [FoldersPage]
})
export class FoldersPageModule {}
