import { Component, inject, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Genre } from '../genre';

@Component({
  selector: 'app-add-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-game.html',
  styleUrl: './add-game.css'
})
export class AddGame implements OnInit {
  gameName = '';
  gameGenreId: number | null = null;
  gamePrice = '';
  gameReleaseDate = '';
  gameService = inject(GameService);
  genres: Genre[] = [];
  router = inject(Router);
  loading = false;
  error = '';

  ngOnInit() {
    this.loadGenres();
  }
  
  loadGenres() {
    this.loading = true;
    this.error = '';
    this.gameService.getAllGenre().subscribe({
      next: (genreData) => {
        this.genres = genreData;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load genres. Please make sure the server is running.';
        this.loading = false;
      }
    });
  }

  addGame(event: Event) {
    event.preventDefault();
    
    // Validate required fields
    if (!this.gameName || !this.gameGenreId || !this.gamePrice || !this.gameReleaseDate) {
      this.error = 'Please fill in all required fields';
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    // The backend expects genreId as a string
    const genreId = this.gameGenreId !== null ? String(this.gameGenreId) : '';
    
    // Format the date as YYYY-MM-DD
    const releaseDate = this.gameReleaseDate 
      ? new Date(this.gameReleaseDate).toISOString().split('T')[0] 
      : '';
    
    const payload = {
      name: this.gameName,
      genreId: genreId,
      price: parseFloat(this.gamePrice),
      releaseDate: releaseDate
    };
    
    this.gameService.addGame(payload).subscribe({
      next: (response) => {
        this.loading = false;
        this.resetForm();
        this.router.navigateByUrl('/', { replaceUrl: true });
      },
      error: (err) => {
        this.error = 'Failed to add the game. Please try again.';
        this.loading = false;
      }
    });
  }
  
  resetForm() {
    this.gameName = '';
    this.gameGenreId = null;
    this.gamePrice = '';
    this.gameReleaseDate = '';
  }
  
  cancel() {
    // Navigate back to the home page when canceling
    this.router.navigateByUrl('/');
  }
}
