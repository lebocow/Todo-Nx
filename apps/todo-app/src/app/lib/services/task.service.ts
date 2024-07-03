import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import { IApiResponse } from '@lib/interfaces';
import {
  ICreateTaskResponse,
  ITask,
  ITaskResponse,
} from '@myworkspace/data-models';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly httpClient = inject(HttpClient);

  tasks = signal<ITask[]>([]);

  addTask(
    title: string,
    description: string,
    dueDate: Date,
    dueTime: string,
    categoryId: string,
  ): Observable<IApiResponse<ICreateTaskResponse>> {
    return this.httpClient
      .post<IApiResponse<ICreateTaskResponse>>(
        `${environment.apiUrl}/task/create`,
        {
          title,
          description,
          dueDate: dueDate.toISOString(),
          dueTime,
          categoryId,
        },
      )
      .pipe(
        switchMap((res: IApiResponse<ICreateTaskResponse>) => {
          const { task } = res.data;

          this.tasks.update((tasks) => [...tasks, task]);

          return of(res);
        }),
        catchError((error: Error) => {
          return throwError(() => error);
        }),
      );
  }

  getTasks() {
    return this.httpClient
      .get<IApiResponse<ITaskResponse>>(`${environment.apiUrl}/task`)
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
}
