import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { GameService } from '../game.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Genre } from '../genre';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-game.html',
  styleUrl: './add-game.css'
})
export class AddGame implements OnInit, OnDestroy {
  gameName = '';
  gameGenreId: number | null = null;
  gamePrice = '';
  gameReleaseDate = '';
  gameService = inject(GameService);
  genres: Genre[] = [];
  router = inject(Router);
  loading = false;
  error = '';
  private subscriptions: Subscription[] = [];
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    console.log('AddGame ngOnInit called');
    this.loadGenres();
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  
  loadGenres() {
    this.loading = true;
    this.error = '';
    
    // Add a timeout as a fallback
    const timeoutId = setTimeout(() => {
      console.log('Timeout reached - forcing loading to false');
      this.loading = false;
      this.error = 'Loading timed out. Please try again.';
    }, 5000); // 5 second timeout
    
    const subscription = this.gameService.getAllGenre().subscribe({
      next: (genreData) => {
        clearTimeout(timeoutId); // Clear the timeout since we got a response
        this.genres = genreData;
        this.loading = false;
        this.cdr.detectChanges(); // Force change detection
        if (genreData.length === 0) {
          this.error = 'No genres found. Please contact the administrator.';
        }
      },
      error: (err) => {
        console.error('Error in subscription:', err);
        clearTimeout(timeoutId); // Clear the timeout since we got an error
        this.error = 'Failed to load genres. Please check your connection and try again.';
        this.loading = false;
        this.genres = []; // Ensure genres array is empty on error
        this.cdr.detectChanges(); // Force change detection
      },
      complete: () => {
        console.log('Observable completed');
      }
    });
    console.log('Subscription created, adding to subscriptions array');
    this.subscriptions.push(subscription);
  }

  addGame(event: Event) {
    event.preventDefault();
    
    // Validate required fields
    if (!this.gameName || !this.gameGenreId || !this.gamePrice || !this.gameReleaseDate) {
      this.error = 'Please fill in all required fields';
      return;
    }

    // Check if genres are available
    if (this.genres.length === 0) {
      this.error = 'No genres available. Please reload genres first.';
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    // The backend expects genreId as a string
    const genreId = this.gameGenreId !== null ? String(this.gameGenreId) : '';
    
    // Format the date as YYYY-MM-DD
    const releaseDate = this.gameReleaseDate 
      ? new Date(this.gameReleaseDate).toISOString().split('T')[0] 
      : '';
    
    const payload = {
      name: this.gameName,
      genreId: genreId,
      price: parseFloat(this.gamePrice),
      releaseDate: releaseDate
    };
    
    this.gameService.addGame(payload).subscribe({
      next: (response) => {
        this.loading = false;
        this.resetForm();
        this.router.navigateByUrl('/', { replaceUrl: true });
      },
      error: (err) => {
        this.error = 'Failed to add the game. Please try again.';
        this.loading = false;
      }
    });
  }
  
  forceStopLoading() {
    console.log('Force stopping loading');
    this.loading = false;
    this.cdr.detectChanges();
  }
  
  resetForm() {
    this.gameName = '';
    this.gameGenreId = null;
    this.gamePrice = '';
    this.gameReleaseDate = '';
  }
  
  cancel() {
    // Navigate back to the home page when canceling
    this.router.navigateByUrl('/');
  }
}
