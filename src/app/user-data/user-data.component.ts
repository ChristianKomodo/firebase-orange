import { Firestore, collection, collectionData, addDoc, CollectionReference, DocumentReference, getDoc, doc, getDocs, onSnapshot, deleteDoc } from '@angular/fire/firestore';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { Auth, UserProfile, user } from '@angular/fire/auth';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ViewChild, ElementRef } from '@angular/core';


import { Movie, MovieSearchResult } from '../models/models';

@Component({
  selector: 'app-user-data',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss'],
})
export class UserDataComponent implements OnInit {
  @ViewChild('searchResults') searchResults!: ElementRef;
  // @ViewChild('searchResults', { read: ElementRef, static: false }) searchResults!: ElementRef;
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
  movieDetailsResults: Movie | null = null;
  message = '';
  modalOpen = false;
  movieToRemove: (string | null) = null;

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
            console.log('doc.id:', doc.id);
            const movieItem: Movie = doc.data() as Movie;
            // Add the document id to the movie object
            movieItem.id = doc.id;
            this.someMovies.unshift(movieItem);
          });
          console.log('someMovies:', this.someMovies);
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
  searchMovieDetails(imdbID: string): Observable<any> {
    const apiKey = '76a7475a';
    const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;
    return this.http.get(url);
  }

  onMovieSearchDetails(imdbID: string): void {
    this.searchMovieDetails(imdbID).subscribe({
      next: response => {
        this.message = '';
        console.log('searchMovieDetails() response:', response);
        // handle errors
        if (response.Response === 'False') {
          console.log('Error:', response.Error);
          this.message = `⚠️ ${response.Error}`;
          return;
        }
        // proccess results
        this.movieDetailsResults = response;
        console.log('movieDetailsResults HERE:', this.movieDetailsResults);
        this.modalOpen = true;
      },
      error: error => {
        console.error('Error occurred:', error);
        this.message = `⚠️ ${error}`;
      }
    });
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
        } else {
          // success results (response was "true")
          this.movieSearchResults = response.Search;
          setTimeout(() => {
            this.searchResults.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 250);
        }
      },
      error: error => {
        console.error('Error occurred:', error);
        this.message = `⚠️ ${error}`;
      }
    });
  }

  onAddMovie(movie: Movie): void {
    if (this.someMovies.find(item => item.imdbID === movie.imdbID)) {
      console.log('movie already in list');
      this.message = `⚠️ "${movie.Title}" is already in your list`;
      return;
    }
    addDoc(collection(this.firestore, 'users', this.uid, 'movies'), movie).then((docRef: DocumentReference) => {
      console.log('Document written with ID: ', docRef.id);
      this.message = `✅ Added "${movie.Title}" to your list`;
    }
    ).catch((error) => {
      console.error('Error adding document: ', error);
    });
  }

  onRemoveMovie(movie: Movie): void {
    console.log('removing this movie:', movie);
    const movieDoc = doc(this.firestore, 'users', this.uid, 'movies', movie.id);
    getDoc(movieDoc).then((docSnap) => {
      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data());
        // delete the document
        this.movieToRemove = movie.imdbID;
        setTimeout(() => {
          // this.movieSearchResults = this.movieSearchResults.filter(m => m !== movie);
          this.movieToRemove = null;
          this.message = `✅ Removed "${movie.Title}" from your list`;
          // this.someMovies = this.someMovies.filter(item => item.id !== movie.id);
          deleteDoc(movieDoc);
        }, 500);
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document to remove!');
      }
    }).catch((error) => {
      console.log('Error getting document:', error);
    });
  }

  onModalClose(): void {
    this.modalOpen = false;
  }
}
