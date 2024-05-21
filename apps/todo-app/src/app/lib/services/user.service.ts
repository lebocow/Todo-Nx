import { Injectable, signal } from '@angular/core';
import { IUser } from '@myworkspace/data-models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly user = signal<IUser | null>(null);
}
