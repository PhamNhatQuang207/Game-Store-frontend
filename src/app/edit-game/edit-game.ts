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
  loading = true;
  error = '';
  
  constructor() {}
  
  ngOnInit() {
    // Load genres
    this.gameService.getAllGenre().subscribe({
      next: (genreData) => {
        this.genres = genreData;
        console.log('Genres loaded:', this.genres);
      },
      error: (err) => {
        this.error = 'Failed to load genres';
        console.error('Error loading genres:', err);
      }
    });
    
    // Load game details
    const gameId = Number(this.route.snapshot.queryParamMap.get('id'));
    if (gameId) {
      this.gameService.getGameById(gameId).subscribe({
        next: (gameData) => {
          this.game = gameData;
          this.loading = false;
          console.log('Game loaded:', this.game);
        },
        error: (err) => {
          this.error = 'Failed to load game details';
          this.loading = false;
          console.error('Error loading game:', err);
        }
      });
    } else {
      this.error = 'No game ID provided';
      this.loading = false;
    }
  }
  
  updateGame(event: Event) {
    event.preventDefault();
    if (this.game) {
      this.gameService.updateGame(this.game).subscribe({
        next: () => {
          console.log('Game updated successfully');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error updating game:', err);
          alert('Failed to update the game. Please try again.');
        }
      });
    }
  }
  
  cancel() {
    this.router.navigate(['/']);
  }
}
