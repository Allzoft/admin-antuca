import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  providers: [PrimeNGConfig],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'admin';
  constructor(private primengConfig: PrimeNGConfig){
    this.primengConfig.ripple = true;
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }
}
