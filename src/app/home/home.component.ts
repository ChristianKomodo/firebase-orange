import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecommendationComponent } from '../recommendation/recommendation.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RecommendationComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
}