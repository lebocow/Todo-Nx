import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  Signal,
} from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { ICategory } from '@myworkspace/data-models';
import { injectQueryParams } from 'ngxtension/inject-query-params';

@Component({
  selector: 'app-category-chip',
  standalone: true,
  imports: [CommonModule, MatRippleModule],
  templateUrl: './category-chip.component.html',
  styleUrl: './category-chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryChipComponent {
  private readonly router = inject(Router);

  readonly category = input.required<ICategory>();

  private readonly categoryIds = injectQueryParams.array('category', {
    transform: (value: string) => value,
    initialValue: [],
  }) as Signal<string[]>;

  readonly isSelected = computed(() =>
    this.categoryIds().includes(this.category().id),
  );

  onCategoryClick() {
    const categoryId = this.category().id;
    let newCategories: string[];

    if (this.isSelected()) {
      newCategories = this.categoryIds().filter((id) => id !== categoryId);
    } else {
      newCategories = [...this.categoryIds(), categoryId];
    }

    this.router.navigate([], {
      queryParams: { category: newCategories },
      queryParamsHandling: 'merge',
    });
  }
}
