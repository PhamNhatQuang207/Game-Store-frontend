import { Component,inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameService } from '../game.service';
import { Game } from '../game';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-edit-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-game.html',
  styleUrl: './edit-game.css'
})
export class EditGame {
  route: ActivatedRoute = inject(ActivatedRoute);
  gameService = inject(GameService);
  game: Game | undefined;
  router = inject(Router);
  genres = this.gameService.getAllGenre();
  constructor () {
    const gameId = Number(this.route.snapshot.queryParamMap.get('id'));
    this.game = this.gameService.getGameById(gameId);
  }
  updateGame(event: Event) {
    event.preventDefault();
    if (this.game) {
      this.gameService.updateGame(this.game);
      this.router.navigate(['/']);
    }
  }
  cancel() {
    this.router.navigate(['/']);
  }
}
