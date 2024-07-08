import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { NavbarComponent } from '@lib/components';

import { RouterOutlet } from '@angular/router';
import { TaskService } from '@lib/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private readonly taskSvc = inject(TaskService);
  private readonly toastrSvc = inject(ToastrService);

  ngOnInit(): void {
    this.taskSvc.getTasks().subscribe({
      next: (data) => {
        this.toastrSvc.success(data.message, 'Success');
      },
      error: (error: Error) => {
        this.toastrSvc.error(error.message, 'Error');
      },
    });
  }
}
