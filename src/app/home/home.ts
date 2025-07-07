import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
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
export class Home implements OnInit, OnDestroy {
  gameService = inject(GameService);
  gameList: Game[] = [];
  loading = true;
  error = '';
  private subscription = new Subscription();
  
  constructor(private router: Router) {
    console.log('Home component constructed');
    
    // Subscribe to router navigation events
    const routerSub = this.router.events.pipe(
      // Only care about NavigationEnd events
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // If we've navigated to the home page, reload the games
      if (event.url === '/' || event.url === '') {
        console.log('Navigated back to home, reloading games');
        this.loadGames();
      }
    });
    
    // Add to subscription collection for cleanup
    this.subscription.add(routerSub);
  }
  
  ngOnInit() {
    console.log('Home component initialized');
    this.loadGames();
  }
  
  ngOnDestroy() {
    // Clean up all subscriptions
    console.log('Cleaning up subscriptions');
    this.subscription.unsubscribe();
  }
  
  loadGames() {
    this.loading = true;
    this.error = '';
    
    console.log('Loading games...');
    
    const gamesSub = this.gameService.getAllGames().subscribe({
      next: (games) => {
        console.log('Games loaded successfully:', games);
        this.gameList = games;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading games:', err);
        this.error = `Failed to load games: ${err.message || 'Unknown error'}`;
        this.loading = false;
      }
    });
    
    // Add to subscription collection for cleanup
    this.subscription.add(gamesSub);
  }
  
  onButtonClick() {
    this.router.navigate(['/add-game']);
  }
}
