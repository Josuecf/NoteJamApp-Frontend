import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { CollapsibleHeaderComponent } from './components/collapsible-header/collapsible-header.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { FloatingSearchActionComponent } from './components/floating-search-action/floating-search-action.component';
import { FullScreenLoaderComponent } from './components/full-screen-loader/full-screen-loader.component';
import { SwipeActionsComponent } from './components/swipe-actions/swipe-actions.component';
import { AnimatedPageTitleComponent } from './components/animated-page-title/animated-page-title.component';
import { GroupedListComponent } from './components/grouped-list/grouped-list.component';
import { TopNavbarComponent } from './components/top-navbar/top-navbar.component';

@NgModule({
  declarations: [
    AnimatedPageTitleComponent,
    CollapsibleHeaderComponent,
    ConfirmModalComponent,
    FloatingSearchActionComponent,
    FullScreenLoaderComponent,
    GroupedListComponent,
    SwipeActionsComponent,
    TopNavbarComponent
  ],
  imports: [CommonModule, IonicModule],
  exports: [
    AnimatedPageTitleComponent,
    CollapsibleHeaderComponent,
    ConfirmModalComponent,
    FloatingSearchActionComponent,
    FullScreenLoaderComponent,
    GroupedListComponent,
    SwipeActionsComponent,
    TopNavbarComponent
  ]
})
export class SharedModule {}
