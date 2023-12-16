import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CollectionReference, Firestore, collection, collectionData, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { Auth, user } from '@angular/fire/auth';

// Reference:
// https://github.com/angular/angularfire/blob/master/docs/firestore.md

@Component({
    selector: 'app-firestore',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './firestore.component.html',
    styleUrls: ['./firestore.component.scss']
})
export class FirestoreComponent implements OnInit {
    // Authenticated user
    private auth: Auth = inject(Auth);
    usersCollection!: CollectionReference;
    user$ = user(this.auth);
    private userDataSubject = new BehaviorSubject<any | null>(null);
    // private userDataSubject = new BehaviorSubject<UserData | null>(null);  // ToDo: Why does this not work?
    userData$ = this.userDataSubject.asObservable();
    uid!: string;
    movieData!: string[];
    dataForm!: FormGroup;

    constructor(private firestore: Firestore, private fb: FormBuilder) { }

    ngOnInit(): void {
        this.setUpForms();

        this.usersCollection = collection(this.firestore, 'users');

        // Get the user's data from the users collection
        const uuid = this.user$.subscribe((user) => {
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
                console.log('user is not signed in');
            }
        });
    }

    setUpForms() {
        this.dataForm = this.fb.group({
            movie: ['', Validators.required]
        });
    }

    updateUserData() {
        const userDoc = doc(this.firestore, 'users', this.uid);
        const formData = this.dataForm.value;
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