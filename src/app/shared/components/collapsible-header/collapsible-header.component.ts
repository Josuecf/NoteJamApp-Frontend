import { Component, Input } from '@angular/core';

const COLLAPSE_THRESHOLD = 4;
const GESTURE_THRESHOLD = 6;

@Component({
  selector: 'app-collapsible-header',
  templateUrl: './collapsible-header.component.html',
  styleUrls: ['./collapsible-header.component.scss'],
  standalone: false
})
export class CollapsibleHeaderComponent {
  @Input() title = '';
  @Input() viewMode = false;
  isScrolled = false;
  private gestureStartY?: number;

  handleScroll(event: Event) {
    const scrollTop = (event as CustomEvent<{ scrollTop: number }>).detail?.scrollTop ?? 0;
    const nextState = scrollTop > COLLAPSE_THRESHOLD;

    if (nextState !== this.isScrolled) {
      this.isScrolled = nextState;
    }
  }

  handleGestureStart(event: TouchEvent) {
    this.gestureStartY = event.touches[0]?.clientY;
  }

  handleGestureMove(event: TouchEvent) {
    const currentY = event.touches[0]?.clientY;

    if (this.gestureStartY === undefined || currentY === undefined) {
      return;
    }

    if (this.gestureStartY - currentY > GESTURE_THRESHOLD) {
      this.isScrolled = true;
    }
  }

  async handleGestureEnd(event: TouchEvent) {
    this.gestureStartY = undefined;
    const content = event.currentTarget as HTMLIonContentElement | null;

    if (!content) {
      return;
    }

    const scrollElement = await content.getScrollElement();

    if (scrollElement.scrollHeight <= scrollElement.clientHeight + 1) {
      this.isScrolled = false;
    }
  }

  handleGestureCancel() {
    this.gestureStartY = undefined;
    this.isScrolled = false;
  }
}
