import { Injectable } from '@angular/core';
import { Game } from './game';
import { Genre } from './genre';
@Injectable({
  providedIn: 'root'
})
export class GameService {
  protected gameList: Game[] = [
    {
      id: 1,
      name: 'Game 1',
      genre: 'Action',
      releaseDate: new Date('2023-01-01'),
      price: 59.99
    },
    {
      id: 2,
      name: 'Game 2',
      genre: 'Adventure',
      releaseDate: new Date('2023-02-01'),
      price: 49.99
    }
  ];
  protected genreList: Genre[] = [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Adventure' },
    { id: 3, name: 'Role-Playing' },
    { id: 4, name: 'Simulation' },
    { id: 5, name: 'Strategy' },
  ];
  constructor() {}
  getAllGenre(): Genre[] {
    return this.genreList;
  }
  getAllGames(): Game[] {
    return this.gameList;
  }
  getGameById(id: number): Game | undefined {
    return this.gameList.find(game => game.id === id);
  }
  addGame(game: Game): void {
    this.gameList.push(game);
  }
  deleteGameById(id: number): void {
    const idx = this.gameList.findIndex(game => game.id === id);
    if (idx !== -1) {
      this.gameList.splice(idx, 1);
    }
  }
  updateGame(updatedGame: Game): void {
    const idx = this.gameList.findIndex(game => game.id === updatedGame.id);
    if (idx !== -1) {
      this.gameList[idx] = updatedGame;
    }
  }
}
