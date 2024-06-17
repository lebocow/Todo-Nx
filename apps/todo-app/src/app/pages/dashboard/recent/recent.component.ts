import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TaskCardComponent } from '@lib/components';

@Component({
  selector: 'app-recent',
  standalone: true,
  templateUrl: './recent.component.html',
  styleUrl: './recent.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatChipsModule, MatSidenavModule, TaskCardComponent],
})
export class RecentComponent {}
