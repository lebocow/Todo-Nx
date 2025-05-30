import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  OnDestroy,
  OnInit,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  CategoryService,
  FloatingTaskFormService,
  TaskService,
} from '@lib/services';
import { zodValidator } from '@lib/validators/zod-validator.validator';
import { CreateTaskSchema, ITask, IUpdateTask } from '@myworkspace/data-models';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
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
  private readonly toastrSvc = inject(ToastrService);

  readonly categoriesSvc = inject(CategoryService);
  readonly taskSvc = inject(TaskService);
  readonly floatingTaskFormSvc = inject(FloatingTaskFormService);

  dueTimeInput = viewChild<ElementRef<HTMLInputElement>>('dueTimeInput');

  minDate = signal(new Date());
  isSubmitting = signal(false);

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
  categoryId = new FormControl<string | null>(
    null,
    zodValidator(CreateTaskSchema.shape.categoryId),
  );

  taskForm = new FormGroup({
    title: this.title,
    description: this.description,
    dueDate: this.dueDate,
    dueTime: this.dueTime,
    categoryId: this.categoryId,
  });

  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline'],
    ['bullet_list', 'ordered_list'],
    ['link'],
    ['undo', 'redo'],
  ];

  @HostBinding('@slideUpDown') get slideState() {
    return this.floatingTaskFormSvc.isOpened() ? 'opened' : 'closed';
  }

  constructor() {
    effect(() => {
      const taskData = this.floatingTaskFormSvc.taskData();

      if (!taskData) return;

      this.title.setValue(taskData.title);
      this.description.setValue(taskData.description);
      this.dueDate.setValue(new Date(taskData.dueDate));
      this.dueTime.setValue(taskData.dueTime);
      if (taskData.category?.id) this.categoryId.setValue(taskData.category.id);
      if (this.dueTimeInput()) {
        const dueTimeInput =
          this.dueTimeInput() as ElementRef<HTMLInputElement>;
        dueTimeInput.nativeElement.value = taskData.dueTime;
      }
    });
  }

  ngOnInit(): void {
    this.editor = new Editor();
  }

  populateForm(taskData: ITask) {
    this.taskForm.patchValue(taskData);
  }

  onDateSelected(date: Date) {
    this.dueDate.setValue(date);
  }

  onSlideUp() {
    this.floatingTaskFormSvc.isOpened.set(true);
  }

  onSlideDown() {
    this.floatingTaskFormSvc.close();
    this.taskForm.reset();
    if (this.dueTimeInput()) {
      const dueTimeInput = this.dueTimeInput() as ElementRef<HTMLInputElement>;
      dueTimeInput.nativeElement.value = '';
    }
  }

  onConfirmDueTime($event: string) {
    if (!$event) {
      if (this.dueTimeInput()) {
        const dueTimeInput =
          this.dueTimeInput() as ElementRef<HTMLInputElement>;
        dueTimeInput.nativeElement.value = '';
      }
    }
    this.dueTime.patchValue($event);
  }

  onSaveTask() {
    if (this.taskForm.invalid || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);

    const taskData = this.floatingTaskFormSvc.taskData();
    const operation = taskData
      ? this.taskSvc.updateTask({
          ...(this.taskForm.value as IUpdateTask),
          id: taskData.id,
        })
      : this.taskSvc.addTask(this.taskForm.value as ITask);

    operation.subscribe({
      next: (res) => {
        this.toastrSvc.success(res.message);
        this.onSlideDown();
      },
      error: (error: Error) => {
        this.toastrSvc.error(error.message);
        this.isSubmitting.set(false);
      },
      complete: () => {
        this.isSubmitting.set(false);
      },
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
