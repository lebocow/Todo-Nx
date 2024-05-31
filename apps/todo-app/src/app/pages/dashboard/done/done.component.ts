import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-done',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './done.component.html',
  styleUrl: './done.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoneComponent {}
