import { Firestore, collection, collectionData, addDoc, CollectionReference, DocumentReference, getDoc, doc, getDocs, onSnapshot } from '@angular/fire/firestore';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { Auth, UserProfile, user } from '@angular/fire/auth';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { Movie, MovieSearchResult } from '../models/models';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-user-data',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss'],
  // animations: [
  //   trigger('fadeInOut', [
  //     state('void', style({
  //       opacity: 0
  //     })),
  //     transition(':enter, :leave', [
  //       animate(500)
  //     ]),
  //   ]),
  // ]
})
export class UserDataComponent implements OnInit {
  private firestore: Firestore = inject(Firestore); // inject Cloud Firestore
  users$: Observable<UserProfile[]>;
  moviesCollection!: CollectionReference;
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  uid!: string;
  someMovies: Movie[] = [];
  movieForm!: FormGroup;
  movieSearchForm!: FormGroup;
  movieSearchReponse$!: Observable<MovieSearchResult>;
  movieSearchResults: Movie[] = [];
  message = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    // get a reference to the user-profile collection
    const userProfileCollection = collection(this.firestore, 'users');
    // get documents (data) from the collection using collectionData
    this.users$ = collectionData(userProfileCollection) as Observable<UserProfile[]>;
  }

  ngOnInit(): void {
    this.setUpForms();

    // get the uid of the current logged-in user
    this.user$.subscribe((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // User interface: https://firebase.google.com/docs/reference/js/auth.user
        this.uid = user.uid;
        if (!this.uid) {
          console.error('user uid is empty');
          return;
        }

        // get the "movies" collection within the user's document
        const moviesCollection = collection(this.firestore, 'users', this.uid, 'movies');

        // set up a real-time listener on the "movies" collection
        onSnapshot(moviesCollection, (querySnapshot) => {
          this.someMovies = []; // clear the array before adding the updated data
          querySnapshot.forEach((doc) => {
            const movieItem: Movie = doc.data() as Movie;
            this.someMovies.unshift(movieItem);
          });
        });
      }
    });
  }

  setUpForms() {
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      year: ['', Validators.required],
      imdbid: ['', [Validators.required, this.omdbidValidator()]],
    });

    this.movieSearchForm = this.fb.group({
      title: ['', Validators.required]
    });
  }

  omdbidValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const valid = /^tt\d{6,10}$/.test(value);
      return valid ? null : { invalidOmdbid: true };
    };
  }

  addMovie(): void {
    const movie = this.movieForm.value;
    console.log('movie form values:', this.movieForm.value);
    if (!movie.Title || !movie.Year || !movie.imdbID) {
      console.log('missing movie data');
      return
    }
    console.log('adding movie', movie);
    addDoc(collection(this.firestore, 'users', this.uid, 'movies'), movie);
  }

  // get movie search results from the OMDB API
  searchMovie(title: string): Observable<any> {
    const apiKey = '76a7475a';
    const url = `https://www.omdbapi.com/?s=${title}&apikey=${apiKey}`;
    return this.http.get(url);
  }

  onMovieSearch(): void {
    const title = this.movieSearchForm.get('title')?.value;
    if (!title) {
      console.log('missing movie title');
      return;
    }
    this.searchMovie(title).subscribe({
      next: response => {
        this.message = '';
        console.log('searchMovie() response:', response);
        // handle errors
        if (response.Response === 'False') {
          console.log('Error:', response.Error);
          this.message = `⚠️ ${response.Error}`;
          return;
        }
        // proccess results
        this.movieSearchResults = response.Search;
      },
      error: error => {
        console.error('Error occurred:', error);
        this.message = `⚠️ ${error}`;
      }
    });
  }
}
