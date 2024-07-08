import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import { IApiResponse } from '@lib/interfaces';
import {
  ICategory,
  ICategoryResponse,
  ICreateCategoryResponse,
} from '@myworkspace/data-models';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly HttpClient = inject(HttpClient);

  readonly categories = signal<ICategory[]>([]);

  getCategories(): Observable<IApiResponse<ICategoryResponse>> {
    return this.HttpClient.get<IApiResponse<ICategoryResponse>>(
      `${environment.apiUrl}/category`,
    ).pipe(
      switchMap((res) => {
        const { categories } = res.data;

        this.categories.set(categories);

        return of(res);
      }),
      catchError((error: Error) => {
        return throwError(() => error);
      }),
    );
  }

  addCategory(
    name: string,
    color: string,
  ): Observable<IApiResponse<ICreateCategoryResponse>> {
    return this.HttpClient.post<IApiResponse<ICreateCategoryResponse>>(
      `${environment.apiUrl}/category/create`,
      {
        name,
        color,
      },
    ).pipe(
      switchMap((res: IApiResponse<ICreateCategoryResponse>) => {
        const { category } = res.data;

        this.categories.update((categories) => [...categories, category]);
        return of(res);
      }),
      catchError((error: Error) => {
        return throwError(() => error);
      }),
    );
  }
}
