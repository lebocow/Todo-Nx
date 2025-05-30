import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  OnDestroy,
  OnInit,
  computed,
  inject,
  Signal,
} from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FloatingTaskFormComponent, TaskCardComponent } from '@lib/components';
import { CategoryChipComponent } from '@lib/components/category-chip/category-chip.component';
import { CategoryService, TaskService } from '@lib/services';
import { ITask } from '@myworkspace/data-models';
import { injectQueryParams } from 'ngxtension/inject-query-params';

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
    CategoryChipComponent,
    MatRippleModule,
  ],
})
export class RecentComponent implements OnInit, OnDestroy {
  readonly taskSvc = inject(TaskService);
  readonly categorySvc = inject(CategoryService);

  private readonly selectedCategoryIds = injectQueryParams.array('category', {
    transform: (value: string) => value,
    initialValue: [],
  }) as Signal<string[]>;

  readonly filteredTasks = computed(() => {
    const tasks = this.taskSvc.tasks();
    const selectedCategories = this.selectedCategoryIds();

    if (selectedCategories.length === 0) {
      return tasks;
    }

    return tasks.filter((task: ITask) => 
      task.category?.id && selectedCategories.includes(task.category.id)
    );
  });

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
