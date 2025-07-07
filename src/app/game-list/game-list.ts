import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
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
  @Output() gameDeleted = new EventEmitter<Game>();
  
  constructor(private gameService: GameService, private router: Router) {}
  onEditGame(game: Game) {
    this.router.navigate(['/edit-game'], { queryParams: { id: game.id } });
  }

  onDeleteGame(game: Game) {
    if (confirm('Are you sure you want to delete this game?')) {
      this.gameService.deleteGameById(game.id).subscribe({
        next: () => {
          // Emit event to notify parent component
          this.gameDeleted.emit(game);
          // Also update local array for immediate UI feedback
          this.gameList = this.gameList.filter(g => g.id !== game.id);
        },
        error: (_) => {
          alert('Failed to delete the game. Please try again.');
        }
      });
    }
  }
}
