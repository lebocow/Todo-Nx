import { Injectable, signal } from '@angular/core';
import { ITask } from '@myworkspace/data-models';

@Injectable({
  providedIn: 'root',
})
export class FloatingTaskFormService {
  readonly isOpened = signal(false);
  readonly taskData = signal<ITask | null>(null);

  openWithData(taskData: ITask) {
    this.taskData.set(taskData);
    this.isOpened.set(true);
  }

  close() {
    this.taskData.set(null);
    this.isOpened.set(false);
  }
}
