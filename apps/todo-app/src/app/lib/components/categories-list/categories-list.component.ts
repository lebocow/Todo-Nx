import { MatListModule } from '@angular/material/list';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ICategory } from '@myworkspace/data-models';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatListModule],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesListComponent {
  category = input<ICategory>();
}
