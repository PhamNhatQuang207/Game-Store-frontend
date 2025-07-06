import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GameList } from "../game-list/game-list";
import { GameService } from "../game.service";
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GameList],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  gameService = inject(GameService);
  get gameList() {
    return this.gameService.getAllGames();
  }
  onButtonClick() {
    this.router.navigate(['/add-game']);
  }
  constructor(private router: Router) {}
}
