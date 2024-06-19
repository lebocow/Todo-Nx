import { MatListModule } from '@angular/material/list';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { CategoryService } from '@lib/services/category.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatListModule, MatToolbar],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesListComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly toastrSvc = inject(ToastrService);
  readonly categoriesSvc = inject(CategoryService);

  ngOnInit(): void {
    this.categoriesSvc.getCategories().subscribe({
      next: (res) => {
        this.toastrSvc.success(res.message);
      },
      error: (error: Error) => {
        this.toastrSvc.error(error.message);
      },
    });
  }

  async onCreateNewTag() {
    const { NewTagDialogComponent } = await import('@lib/components');

    this.dialog.open(NewTagDialogComponent, {
      disableClose: true,
    });
  }
}
