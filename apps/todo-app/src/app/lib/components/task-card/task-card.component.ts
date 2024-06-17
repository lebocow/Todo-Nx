import { MatIconModule } from '@angular/material/icon';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  NgZone,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { ITask } from '@myworkspace/data-models';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { ClickOutside } from 'ngxtension/click-outside';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    ClickOutside,
  ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCardComponent {
  private readonly ngzone = inject(NgZone);
  private readonly cdRef = inject(ChangeDetectorRef);

  private readonly drawer = viewChild.required<MatDrawer>('drawer');
  private readonly bar = viewChild.required<ElementRef<HTMLDivElement>>('bar');

  readonly task = input<ITask>();

  private hoverTimeout: ReturnType<typeof setTimeout> | undefined;

  @HostListener('mouseover', ['$event'])
  onMouseOver(event: MouseEvent) {
    if (this.bar().nativeElement === event.target) {
      this.ngzone.runOutsideAngular(() => {
        this.hoverTimeout = setTimeout(() => {
          this.drawer().open();
          this.cdRef.detectChanges();
        }, 500);
      });
    }
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    this.ngzone.runOutsideAngular(() => {
      clearTimeout(this.hoverTimeout);
      setTimeout(() => {
        this.drawer().close();
        this.cdRef.detectChanges();
      }, 1000);
    });
  }

  onOpenDrawer() {
    this.drawer().open();
    clearTimeout(this.hoverTimeout);
  }

  onCloseDrawer() {
    this.drawer().close();
  }
}
