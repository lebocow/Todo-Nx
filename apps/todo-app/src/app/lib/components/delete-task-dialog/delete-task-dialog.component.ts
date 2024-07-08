import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { TaskService } from '@lib/services';
import { ITask } from '@myworkspace/data-models';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-delete-task-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './delete-task-dialog.component.html',
  styleUrl: './delete-task-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteTaskDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteTaskDialogComponent>);
  readonly task = inject<ITask>(MAT_DIALOG_DATA);

  readonly taskSvc = inject(TaskService);

  private readonly toastrSvc = inject(ToastrService);

  deleteTask() {
    this.taskSvc.deleteTaskById(this.task.id).subscribe({
      next: (res) => {
        this.toastrSvc.success(res.message);
      },
      error: (error: Error) => {
        this.toastrSvc.error(error.message);
      },
      complete: () => {
        this.dialogRef.close();
      },
    });
  }
}
