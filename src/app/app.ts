import { Component } from '@angular/core';
import { HeadBar } from './components/head-bar/head-bar';
import { SearchBar } from './components/search-bar/search-bar';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [HeadBar, SearchBar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}