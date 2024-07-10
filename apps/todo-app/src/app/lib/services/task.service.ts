import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import { IApiResponse } from '@lib/interfaces';
import {
  ICreateTaskResponse,
  IDeleteTaskResponse,
  ITask,
  ITasksResponse,
  IUpdateTask,
  IUpdateTaskResponse,
} from '@myworkspace/data-models';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly httpClient = inject(HttpClient);

  private readonly categorySvc = inject(CategoryService);

  tasks = signal<ITask[]>([]);

  addTask(
    task: Omit<ITask, 'id'>,
  ): Observable<IApiResponse<ICreateTaskResponse>> {
    return this.httpClient
      .post<IApiResponse<ICreateTaskResponse>>(
        `${environment.apiUrl}/task/create`,
        {
          ...task,
          dueDate: task.dueDate.toISOString(),
        },
      )
      .pipe(
        switchMap((res: IApiResponse<ICreateTaskResponse>) => {
          const { task } = res.data;

          this.tasks.update((tasks) => [...tasks, task]);

          this.categorySvc.categories.update((categories) => {
            return categories.map((category) => {
              if (category.id === task.category?.id) {
                return {
                  ...category,
                  tasksCount: category.tasksCount + 1,
                };
              }
              return category;
            });
          });

          return of(res);
        }),
        catchError((error: Error) => {
          return throwError(() => error);
        }),
      );
  }

  updateTask(task: IUpdateTask): Observable<IApiResponse<IUpdateTaskResponse>> {
    const originalCategoryId = this.tasks().find((t) => t.id === task.id)
      ?.category?.id;

    return this.httpClient
      .put<
        IApiResponse<IUpdateTaskResponse>
      >(`${environment.apiUrl}/task/update`, task)
      .pipe(
        switchMap((res: IApiResponse<IUpdateTaskResponse>) => {
          const { task: updatedTask } = res.data;

          this.tasks.update((tasks) => {
            return tasks.map((t) =>
              t.id === updatedTask.id ? updatedTask : t,
            );
          });

          this.categorySvc.categories.update((categories) => {
            return categories.map((category) => {
              if (
                category.id === updatedTask.category?.id &&
                category.id !== originalCategoryId
              ) {
                return { ...category, tasksCount: category.tasksCount + 1 };
              }
              if (
                category.id === originalCategoryId &&
                category.id !== updatedTask.category?.id
              ) {
                return { ...category, tasksCount: category.tasksCount - 1 };
              }

              return category;
            });
          });

          return of(res);
        }),
      );
  }

  getTasks(): Observable<IApiResponse<ITasksResponse>> {
    return this.httpClient
      .get<IApiResponse<ITasksResponse>>(`${environment.apiUrl}/task`)
      .pipe(
        switchMap((res) => {
          const { tasks } = res.data;

          this.tasks.set(tasks);

          return of(res);
        }),
        catchError((error: Error) => {
          return throwError(() => error);
        }),
      );
  }

  deleteTaskById(id: string): Observable<IApiResponse<IDeleteTaskResponse>> {
    return this.httpClient
      .delete<
        IApiResponse<IDeleteTaskResponse>
      >(`${environment.apiUrl}/task/${id}`)
      .pipe(
        switchMap((res) => {
          const { task } = res.data;

          this.tasks.update((tasks) => {
            return tasks.filter((t) => t.id !== task.id);
          });

          return of(res);
        }),
        catchError((error: Error) => {
          return throwError(() => error);
        }),
      );
  }
}
