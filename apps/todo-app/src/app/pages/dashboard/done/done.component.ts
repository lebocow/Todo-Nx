import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-done',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './done.component.html',
  styleUrl: './done.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoneComponent {}
