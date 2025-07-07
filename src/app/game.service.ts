import { Injectable } from '@angular/core';
import { Game } from './game';
import { Genre } from './genre';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError, tap } from 'rxjs';
import { GameToAdd } from './game-to-add';
@Injectable({
  providedIn: 'root'
})
export class GameService {
  // Allow for both HTTP and HTTPS connections
  url = "http://localhost:5017"; // Default URL
  constructor(private http: HttpClient) {}

  getAllGames(): Observable<Game[]> {
    console.log('Fetching games from:', `${this.url}/games`);
    return this.http.get<Game[]>(`${this.url}/games`).pipe(
      tap(games => console.log('Games received:', games)),
      catchError(this.handleError('Error fetching games'))
    );
  }
  
  getAllGenre(): Observable<Genre[]> {
    console.log('Fetching genres from:', `${this.url}/genres`);
    return this.http.get<Genre[]>(`${this.url}/genres`).pipe(
      tap(genres => console.log('Genres received:', genres)),
      catchError(this.handleError('Error fetching genres'))
    );
  }
  
  getGameById(id: number): Observable<Game> {
    console.log('Fetching game with ID:', id);
    return this.http.get<Game>(`${this.url}/games/${id}`).pipe(
      tap(game => console.log('Game received:', game)),
      catchError(this.handleError('Error fetching game'))
    );
  }
  
  addGame(game: GameToAdd): Observable<GameToAdd> {
    console.log('Adding game:', game);
    return this.http.post<GameToAdd>(`${this.url}/games`, game).pipe(
      tap(newGame => console.log('Game added:', newGame)),
      catchError(this.handleError('Error adding game'))
    );
  }
  
  deleteGameById(id: number): Observable<any> {
    console.log('Deleting game with ID:', id);
    return this.http.delete(`${this.url}/games/${id}`).pipe(
      tap(() => console.log('Game deleted')),
      catchError(this.handleError('Error deleting game'))
    );
  }
  
  updateGame(updatedGame: Game): Observable<Game> {
    console.log('Updating game:', updatedGame);
    return this.http.put<Game>(`${this.url}/games/${updatedGame.id}`, updatedGame).pipe(
      tap(game => console.log('Game updated:', game)),
      catchError(this.handleError('Error updating game'))
    );
  }
  
  private handleError(operation: string) {
    return (error: HttpErrorResponse) => {
      console.error(`${operation}:`, error);
      if (error.status === 0) {
        console.error('Network error or CORS issue. Is the server running?');
      } else {
        console.error(`Backend returned code ${error.status}, body was:`, error.error);
      }
      return throwError(() => new Error(`${operation}: ${error.message}`));
    };
  }
}
