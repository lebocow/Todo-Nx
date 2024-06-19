import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxColorsModule } from 'ngx-colors';
import { zodValidator } from '@lib/validators/zod-validator.validator';
import { CreateCategorySchema } from '@myworkspace/data-models';
import { CategoryService } from '@lib/services/category.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-tag-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    NgxColorsModule,
  ],
  templateUrl: './new-tag-dialog.component.html',
  styleUrl: './new-tag-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewTagDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<NewTagDialogComponent>);

  private readonly categoriesSvc = inject(CategoryService);
  private readonly toastrSvc = inject(ToastrService);

  name = new FormControl<string>('', [
    zodValidator(CreateCategorySchema.shape.name),
  ]);
  color = new FormControl<string>('', [
    zodValidator(CreateCategorySchema.shape.color),
  ]);

  tagForm = new FormGroup({
    name: this.name,
    color: this.color,
  });

  onClose() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.tagForm.invalid) return;
    this.categoriesSvc
      .addCategory(this.name.value!, this.color.value!)
      .subscribe({
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

  onColorChange($event: string) {
    this.color.setValue($event);
  }
}
