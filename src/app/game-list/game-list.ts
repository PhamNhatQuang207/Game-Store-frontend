import { Component,Input,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../game';
import { GameService } from '../game.service';
import { RouterModule, Router } from '@angular/router';
@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './game-list.html',
  styleUrl: './game-list.css'
})
export class GameList {
  @Input() gameList: Game[] = [];
  constructor(private gameService: GameService, private router: Router) {}
  onEditGame(game: Game) {
    this.router.navigate(['/edit-game'], { queryParams: { id: game.id } });
  }

  onDeleteGame(game: Game) {
    if (confirm('Are you sure you want to delete this game?')) {
      this.gameService.deleteGameById(game.id);
    }
  }
}
