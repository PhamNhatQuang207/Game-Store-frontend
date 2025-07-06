import { Component } from '@angular/core';
import { RouterOutlet,RouterModule } from '@angular/router';
import { Header } from './header/header';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected title = 'Game-Store';
}
