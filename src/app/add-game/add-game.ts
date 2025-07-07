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
  gameGenre = '';
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
    this.gameService.getAllGenre().subscribe({
      next: (genreData) => {
        this.genres = genreData;
        this.loading = false;
        console.log('Genres loaded in AddGame:', genreData);
      },
      error: (err) => {
        this.error = 'Failed to load genres';
        this.loading = false;
        console.error('Error loading genres:', err);
      }
    });
  }

  addGame(event: Event) {
    event.preventDefault();
    this.loading = true;
    
    this.gameService.addGame({
      name: this.gameName,
      genre: this.gameGenre,
      price: parseFloat(this.gamePrice),
      releaseDate: new Date(this.gameReleaseDate)
    }).subscribe({
      next: (response) => {
        console.log('Game added successfully:', response);
        this.loading = false;
        this.resetForm();
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error adding game:', err);
        this.error = 'Failed to add the game. Please try again.';
        this.loading = false;
      }
    });
  }
  
  resetForm() {
    this.gameName = '';
    this.gameGenre = '';
    this.gamePrice = '';
    this.gameReleaseDate = '';
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
