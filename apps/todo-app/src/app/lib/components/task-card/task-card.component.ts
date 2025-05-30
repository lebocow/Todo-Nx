import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { FloatingTaskFormService } from '@lib/services';
import { ITask } from '@myworkspace/data-models';
import { ClickOutside } from 'ngxtension/click-outside';
import {
  BehaviorSubject,
  debounceTime,
  filter,
  map,
  of,
  switchMap,
  takeUntil,
  timer,
} from 'rxjs';
import { DeleteTaskDialogComponent } from '../delete-task-dialog/delete-task-dialog.component';

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
  private readonly cdRef = inject(ChangeDetectorRef);
  private readonly dialog = inject(MatDialog);

  private readonly drawer = viewChild.required<MatDrawer>('drawer');
  private readonly bar = viewChild.required<ElementRef<HTMLDivElement>>('bar');

  private readonly floatingTaskFormSvc = inject(FloatingTaskFormService);

  readonly task = input.required<ITask>();

  private readonly hoverState$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.hoverState$
      .pipe(
        debounceTime(500),
        switchMap((isHovering) => {
          if (isHovering) {
            return of(true);
          } else {
            return timer(500).pipe(
              takeUntil(this.hoverState$.pipe(filter((state) => state))),
              map(() => false),
            );
          }
        }),
        takeUntilDestroyed(),
      )
      .subscribe((shouldBeOpen) => {
        if (shouldBeOpen) {
          this.drawer().open();
        } else {
          this.drawer().close();
        }
        this.cdRef.detectChanges();
      });
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver(event: MouseEvent) {
    if (this.bar().nativeElement === event.target || this.drawer().opened) {
      this.hoverState$.next(true);
    }
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    this.hoverState$.next(false);
  }

  onEdit() {
    this.floatingTaskFormSvc.openWithData(this.task());
  }

  onDelete() {
    this.dialog.open(DeleteTaskDialogComponent, {
      data: {
        ...this.task(),
      },
      disableClose: true,
    });
  }

  onOpenDrawer() {
    this.drawer().open();
  }

  onCloseDrawer() {
    this.drawer().close();
  }
}
