import { MatFormFieldModule } from '@angular/material/form-field';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CategoryService, TaskService } from '@lib/services';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { zodValidator } from '@lib/validators/zod-validator.validator';
import { CreateTaskSchema } from '@myworkspace/data-models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-floating-task-form',
  standalone: true,
  templateUrl: './floating-task-form.component.html',
  styleUrl: './floating-task-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgxEditorModule,
  ],
  providers: [provideNativeDateAdapter()],
  animations: [
    trigger('slideUpDown', [
      state('closed', style({ bottom: '-35rem' })),
      state('opened', style({ bottom: '2rem' })),
      transition('closed <=> open', [animate('300ms ease-in-out')]),
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate(
          '300ms ease-in-out',
          style({ opacity: 1, transform: 'scale(1)' }),
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in-out',
          style({ opacity: 0, transform: 'scale(0.8)' }),
        ),
      ]),
    ]),
  ],
})
export class FloatingTaskFormComponent implements OnInit, OnDestroy {
  readonly categoriesSvc = inject(CategoryService);
  readonly taskSvc = inject(TaskService);

  private readonly toastrSvc = inject(ToastrService);

  dueTimeInput =
    viewChild.required<ElementRef<HTMLInputElement>>('dueTimeInput');

  minDate = signal(new Date());
  isOpened = signal(false);

  title = new FormControl('', zodValidator(CreateTaskSchema.shape.title));
  dueDate = new FormControl(
    new Date(),
    zodValidator(CreateTaskSchema.shape.dueDate),
  );

  dueTime = new FormControl('', zodValidator(CreateTaskSchema.shape.dueTime));
  description = new FormControl(
    '',
    zodValidator(CreateTaskSchema.shape.description),
  );
  categoryId = new FormControl(
    null,
    zodValidator(CreateTaskSchema.shape.categoryId),
  );

  taskForm = new FormGroup({
    title: this.title,
    dueDate: this.dueDate,
    dueTime: this.dueTime,
    description: this.description,
    categoryId: this.categoryId,
  });

  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline'],
    ['bullet_list', 'ordered_list'],
    ['link'],
    ['undo', 'redo'],
  ];

  ngOnInit(): void {
    this.editor = new Editor();

    this.dueDate.valueChanges.subscribe(console.log);
    this.dueTime.valueChanges.subscribe(console.log);
  }

  @HostBinding('@slideUpDown') get slideState() {
    return this.isOpened() ? 'opened' : 'closed';
  }

  onDateSelected(date: Date) {
    this.dueDate.setValue(date);
  }

  onSlideUp() {
    this.isOpened.set(true);
  }

  onSlideDown() {
    this.isOpened.set(false);
    this.taskForm.reset();
    this.dueTimeInput().nativeElement.value = '';
  }

  onConfirmDueTime($event: string) {
    if (!$event) {
      this.dueTimeInput().nativeElement.value = '';
    }
    this.dueTime.patchValue($event);
  }

  onCreateTask() {
    if (this.taskForm.invalid) {
      return;
    }

    this.taskSvc
      .addTask(
        this.title.value!,
        this.description.value!,
        this.dueDate.value!,
        this.dueTime.value!,
        this.categoryId.value!,
      )
      .subscribe({
        next: (res) => {
          this.toastrSvc.success(res.message);
        },
        error: (error: Error) => {
          this.toastrSvc.error(error.message);
        },
        complete: () => {
          this.onSlideDown();
        },
      });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
