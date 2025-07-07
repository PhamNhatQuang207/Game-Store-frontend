import { Injectable } from '@angular/core';
import { Game } from './game';
import { Genre } from './genre';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, catchError, tap } from 'rxjs';
import { GameToAdd } from './game-to-add';
@Injectable({
  providedIn: 'root'
})
export class GameService {
  // Using API proxy to handle CORS issues
  url = "/api";
  constructor(private http: HttpClient) {}

  getAllGames(): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.url}/games`).pipe(
      catchError(this.handleError('Error fetching games'))
    );
  }
  
  getAllGenre(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${this.url}/genres`).pipe(
      catchError(this.handleError('Error fetching genres'))
    );
  }
  
  getGameById(id: number): Observable<Game> {
    return this.http.get<Game>(`${this.url}/games/${id}`).pipe(
      catchError(this.handleError('Error fetching game'))
    );
  }
  
  addGame(game: GameToAdd): Observable<GameToAdd> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post<GameToAdd>(`${this.url}/games`, game, { headers }).pipe(
      catchError(this.handleError('Error adding game'))
    );
  }
  
  deleteGameById(id: number): Observable<any> {
    return this.http.delete(`${this.url}/games/${id}`).pipe(
      catchError(this.handleError('Error deleting game'))
    );
  }
  
  updateGame(updatedGame: Game): Observable<Game> {
    return this.http.put<Game>(`${this.url}/games/${updatedGame.id}`, updatedGame).pipe(
      catchError(this.handleError('Error updating game'))
    );
  }
  
  private handleError(operation: string) {
    return (error: HttpErrorResponse) => {
      console.error(`${operation}:`, error);
      
      let errorMessage = 'Unknown error occurred';
      
      if (error.status === 0) {
        errorMessage = 'Cannot connect to server. Please check if the backend server is running on port 5017.';
      } else if (error.status === 404) {
        errorMessage = 'API endpoint not found. Please check the server configuration.';
      } else if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Return a user-facing message
      return throwError(() => new Error(errorMessage));
    };
  }
}
