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
      this.gameService.deleteGameById(game.id).subscribe({
        next: () => {
          console.log(`Game with ID ${game.id} deleted successfully`);
          // Remove the game from the local array to update UI
          this.gameList = this.gameList.filter(g => g.id !== game.id);
        },
        error: (err) => {
          console.error('Error deleting game:', err);
          alert('Failed to delete the game. Please try again.');
        }
      });
    }
  }
}
