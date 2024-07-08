import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import { IApiResponse } from '@lib/interfaces';
import {
  ICreateTaskResponse,
  IDeleteTaskResponse,
  ITask,
  ITasksResponse,
  IUpdateTaskResponse,
} from '@myworkspace/data-models';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly httpClient = inject(HttpClient);

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

          return of(res);
        }),
        catchError((error: Error) => {
          return throwError(() => error);
        }),
      );
  }

  updateTask(task: ITask): Observable<IApiResponse<IUpdateTaskResponse>> {
    return this.httpClient
      .put<
        IApiResponse<IUpdateTaskResponse>
      >(`${environment.apiUrl}/task/update`, task)
      .pipe(
        switchMap((res: IApiResponse<IUpdateTaskResponse>) => {
          const { task } = res.data;

          this.tasks.update((tasks) => {
            return tasks.map((t) => (t.id === task.id ? task : t));
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
