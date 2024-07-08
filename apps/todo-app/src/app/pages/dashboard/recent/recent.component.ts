import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FloatingTaskFormComponent, TaskCardComponent } from '@lib/components';
import { TaskService } from '@lib/services';

@Component({
  selector: 'app-recent',
  standalone: true,
  templateUrl: './recent.component.html',
  styleUrl: './recent.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatChipsModule,
    MatSidenavModule,
    TaskCardComponent,
    FloatingTaskFormComponent,
  ],
})
export class RecentComponent implements OnInit, OnDestroy {
  readonly taskSvc = inject(TaskService);

  private overlayRef!: OverlayRef;
  private floatingTaskFormComponentRef!: ComponentRef<FloatingTaskFormComponent>;
  private readonly overlay = inject(Overlay);

  ngOnInit() {
    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
    });

    const portal = new ComponentPortal(FloatingTaskFormComponent);
    this.floatingTaskFormComponentRef = this.overlayRef.attach(portal);
  }

  ngOnDestroy() {
    this.overlayRef.dispose();
  }
}
