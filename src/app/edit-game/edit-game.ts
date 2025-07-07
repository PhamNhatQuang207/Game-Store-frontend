import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameService } from '../game.service';
import { Game } from '../game';
import { Genre } from '../genre';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-game.html',
  styleUrl: './edit-game.css'
})
export class EditGame implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  gameService = inject(GameService);
  game: Game | undefined;
  router = inject(Router);
  genres: Genre[] = [];
  selectedGenreId: number | null = null;
  loading = true;
  error = '';
  
  constructor() {}
  
  ngOnInit() {
    // First load genres, then load game details
    this.gameService.getAllGenre().subscribe({
      next: (genreData) => {
        this.genres = genreData;
        // Once genres are loaded, load the game details
        this.loadGameDetails();
      },
      error: (_) => {
        this.error = 'Failed to load genres';
        this.loading = false;
      }
    });
  }
  
  loadGameDetails() {
    const gameId = Number(this.route.snapshot.queryParamMap.get('id'));
    if (gameId) {
      this.gameService.getGameById(gameId).subscribe({
        next: (gameData) => {
          this.game = gameData;
          // Store the original genre name for display
          const originalGenre = gameData.genre;
          
          // Find the corresponding genre ID for the edit form
          if (this.genres.length > 0 && originalGenre) {
            // Store the genre ID in our separate property for the form
            this.selectedGenreId = this.findGenreIdByName(originalGenre);
          }
          
          this.loading = false;
        },
        error: (_) => {
          this.error = 'Failed to load game details';
          this.loading = false;
        }
      });
    } else {
      this.error = 'No game ID provided';
      this.loading = false;
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
