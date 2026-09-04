import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { CollapsibleHeaderComponent } from './components/collapsible-header/collapsible-header.component';

@NgModule({
  declarations: [CollapsibleHeaderComponent],
  imports: [CommonModule, IonicModule],
  exports: [CollapsibleHeaderComponent]
})
export class SharedModule {}
