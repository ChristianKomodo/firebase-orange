import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Auth, user } from '@angular/fire/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface UserProfile {
  email: string;
}

@Component({
  selector: 'app-user-data',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss']
})
export class UserDataComponent implements OnInit {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore); // inject Cloud Firestore
  users$: Observable<UserProfile[]>;
  user$ = user(this.auth);
  private userDataSubject = new BehaviorSubject<any | null>(null);
  userData$ = this.userDataSubject.asObservable();
  movieDataForm!: FormGroup;
  movieData!: string[];
  uid: string = '';

  constructor(private fb: FormBuilder) {
    // get a reference to the user-profile collection
    const userProfileCollection = collection(this.firestore, 'users');

    // get documents (data) from the collection using collectionData
    this.users$ = collectionData(userProfileCollection) as Observable<UserProfile[]>;
  }

  ngOnInit(): void {
    this.setUpForms();

    // Get the user
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

        // Get the user's data from the users collection
        getDoc(doc(this.firestore, 'users', this.uid))
          .then((doc) => {
            if (doc.exists()) {
              console.log("Found UserData Document:", doc.data());
              const someData = doc.data();
              console.log('someData', someData);
              this.userDataSubject.next(doc.data()); // Set doc.data() to userData$
              this.movieData = someData['movies'] || [];
              console.log('setting movieData', this.movieData);
            } else {
              console.log("No such document!");
            }
          }).catch((error) => {
            console.log("Error getting document:", error);
          });

      } else {
        console.error('user is not signed in');
        return;
      }
    });
  }

  setUpForms() {
    this.movieDataForm = this.fb.group({
      title: ['', Validators.required]
    });
  }

  updateUserData() {
    const userDoc = doc(this.firestore, 'users', this.uid);
    const formData = this.movieDataForm.value;
    console.log('formData', formData);
    const updatedMovieData = { movies: [...this.movieData, formData.movie] };
    console.log('updatedMovieData', updatedMovieData);
    console.log('form deactivated - need to redo this page');
    return;
    setDoc(userDoc, updatedMovieData, { merge: true }).then(() => {
      console.log('Movie data updated');
    }).catch((error) => {
      console.error('Error updating user data:', error);
    });
  }
}