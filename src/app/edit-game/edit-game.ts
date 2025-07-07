import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameService } from '../game.service';
import { Game } from '../game';
import { Genre } from '../genre';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-game.html',
  styleUrl: './edit-game.css'
})
export class EditGame implements OnInit, OnDestroy {
  route: ActivatedRoute = inject(ActivatedRoute);
  gameService = inject(GameService);
  game: Game | undefined;
  router = inject(Router);
  genres: Genre[] = [];
  selectedGenreId: number | null = null;
  loading = false; 
  error = '';
  private subscriptions: Subscription[] = [];
  private cdr = inject(ChangeDetectorRef);
  
  constructor() {}
  
  ngOnInit() {
    setTimeout(() => {
      this.loading = true;
      this.cdr.detectChanges();
      this.loadGenres();
      this.loadGameDetails();
    }, 0);
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  
  loadGenres() {
    const subscription = this.gameService.getAllGenre().subscribe({
      next: (genreData) => {
        this.genres = genreData;
        this.checkLoadingComplete();
      },
      error: (err) => {
        this.error = 'Failed to load genres. Please check your connection and try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
    this.subscriptions.push(subscription);
  }
  
  loadGameDetails() {
    const gameId = Number(this.route.snapshot.queryParamMap.get('id'));
    if (gameId) {
      const subscription = this.gameService.getGameById(gameId).subscribe({
        next: (gameData) => {
          this.game = gameData;
          // Store the original genre name for display
          const originalGenre = gameData.genre;
          
          // Find the corresponding genre ID for the edit form
          if (this.genres.length > 0 && originalGenre) {
            // Store the genre ID in our separate property for the form
            this.selectedGenreId = this.findGenreIdByName(originalGenre);
          }
          
          this.checkLoadingComplete();
        },
        error: (_) => {
          this.error = 'Failed to load game details';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
      this.subscriptions.push(subscription);
    } else {
      this.error = 'No game ID provided';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
  
  // Helper method to check if both genres and game details are loaded
  private checkLoadingComplete() {
    if (this.genres.length > 0 && this.game) {
      // Both are loaded, we can stop loading
      this.loading = false;
      this.cdr.detectChanges();
      
      // Update the selectedGenreId if we have the game data
      if (this.game.genre) {
        this.selectedGenreId = this.findGenreIdByName(this.game.genre);
      }
    }
  }
  
  updateGame(event: Event) {
    event.preventDefault();
    if (this.game && this.selectedGenreId) {
      // Create a copy of the game with the updated genre
      const selectedGenre = this.genres.find(g => g.id === this.selectedGenreId);
      if (selectedGenre) {
        // Update the genre name for display
        this.game.genre = selectedGenre.name;
        
        // Add genreId as a property to the game object for the update
        (this.game as any).genreId = String(this.selectedGenreId); // Send as string for API
      }
      
      // Send the update to the backend
      this.gameService.updateGame(this.game).subscribe({
        next: () => {
          // Use replaceUrl to ensure home component reloads data when navigating back
          this.router.navigateByUrl('/', { replaceUrl: true });
        },
        error: (_) => {
          alert('Failed to update the game. Please try again.');
        }
      });
    } else {
      alert('Please select a valid genre before updating the game.');
    }
  }
  
  cancel() {
    this.router.navigate(['/']);
  }
  
  // Helper method to find a genre ID by name
  private findGenreIdByName(genreName: string): number | null {
    const match = this.genres.find(g => g.name === genreName);
    return match ? match.id : null;
  }
}
