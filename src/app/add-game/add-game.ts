import { Component, inject } from '@angular/core';
import { GameService } from '../game.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-game.html',
  styleUrl: './add-game.css'
})
export class AddGame {
  gameName = '';
  gameGenre = '';
  gamePrice = '';
  gameReleaseDate = '';
  gameService = inject(GameService);
  genres = this.gameService.getAllGenre();
  router = inject(Router);

  addGame(event: Event) {
    event.preventDefault();
    this.gameService.addGame({
      id: Date.now(),
      name: this.gameName,
      genre: this.gameGenre,
      price: parseFloat(this.gamePrice),
      releaseDate: new Date(this.gameReleaseDate)
    });
    this.gameName = '';
    this.gameGenre = '';
    this.gamePrice = '';
    this.gameReleaseDate = '';
    this.router.navigate(['/']);
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
