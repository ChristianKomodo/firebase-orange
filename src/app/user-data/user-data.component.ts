import { Firestore, collection, collectionData, addDoc, CollectionReference, DocumentReference, getDoc, doc, getDocs } from '@angular/fire/firestore';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Auth, user } from '@angular/fire/auth';
import { query } from '@angular/animations';

interface UserProfile {
  email: string;
}
interface Movie {
  title: string;
  year: string;
  omdbid: string;
}

@Component({
  selector: 'app-user-data',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss']
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

  constructor(private fb: FormBuilder) {
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
        console.log('uid for fetching user data is', this.uid);
        // get the "movies" collection within the user's document
        const moviesCollection = collection(this.firestore, 'users', this.uid, 'movies');
        getDocs(moviesCollection).then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const title = doc.data()['title'];
            const year = doc.data()['year'];
            const omdbid = doc.data()['omdbid'];
            this.someMovies.push({ title: title, year: year, omdbid: omdbid });
            console.log('someMovies', this.someMovies);
          });
        });
      }
    });
  }

  setUpForms() {
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      year: ['', Validators.required],
      omdbid: ['', [Validators.required, this.omdbidValidator()]],
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
    if (!movie.title || !movie.year || !movie.omdbid) {
      console.log('missing movie data');
      return
    }
    console.log('adding movie', movie);
    addDoc(collection(this.firestore, 'users', this.uid, 'movies'), movie);
  }
}