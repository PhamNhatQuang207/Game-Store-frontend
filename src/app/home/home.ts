import { Component, inject, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { GameList } from "../game-list/game-list";
import { GameService } from "../game.service";
import { Game } from '../game';
import { CommonModule } from '@angular/common';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GameList, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy, AfterViewInit {
  gameService = inject(GameService);
  gameList: Game[] = [];
  loading = true;
  error = '';
  private subscription = new Subscription();
  private cdr = inject(ChangeDetectorRef);
  
  constructor(private router: Router, private route: ActivatedRoute) {
    console.log('Home component constructed');
  }
  
  ngOnInit() {
    console.log('Home component initialized');
    this.loadGames();
  }
  
  ngAfterViewInit() {
    console.log('Home component view initialized');
    
    // Set up router navigation detection after view is ready
    const routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      console.log('Navigation event:', event.url, event.urlAfterRedirects);
      // Check if we're navigating to home route
      if (event.url === '/' || event.url === '' || event.urlAfterRedirects === '/') {
        console.log('Navigated to home, reloading games');
        // Small delay to ensure everything is ready
        setTimeout(() => {
          this.loadGames();
        }, 50);
      }
    });
    
    this.subscription.add(routerSub);
  }
  
  ngOnDestroy() {
    // Clean up all subscriptions
    console.log('Cleaning up subscriptions');
    this.subscription.unsubscribe();
  }
  
  loadGames() {
    console.log('loadGames() called');
    this.loading = true;
    this.error = '';
    
    const gamesSub = this.gameService.getAllGames().subscribe({
      next: (games) => {
        console.log('Games loaded successfully:', games);
        console.log('Number of games:', games?.length || 0);
        this.gameList = games;
        this.loading = false;
        console.log('Loading set to false. Current gameList length:', this.gameList.length);
        console.log('Current loading state:', this.loading);
        console.log('Current error state:', this.error);
        // Force change detection
        this.cdr.detectChanges();
        console.log('Change detection triggered');
      },
      error: (err) => {
        console.error('Error loading games:', err);
        this.error = 'Failed to load games. Please make sure the server is running.';
        this.loading = false;
      }
    });
    
    // Add to subscription collection for cleanup
    this.subscription.add(gamesSub);
  }
  
  refreshGames() {
    console.log('Manual refresh triggered');
    this.loadGames();
  }
  
  onButtonClick() {
    this.router.navigate(['/add-game']);
  }
}
