import { Routes } from '@angular/router';
import { Home } from './home/home';
import { AddGame } from './add-game/add-game';
import { EditGame } from './edit-game/edit-game';

export const routes: Routes = [
    { path: '', component: Home, title: 'Home Page' },
    { path: 'add-game', component: AddGame, title: 'Add Game Page' },
    { path: 'edit-game', component: EditGame, title: 'Edit Game Page' } 
];
