import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DocumentData, Firestore, QuerySnapshot, addDoc, collection, collectionData, doc, getDoc, getDocs } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataFormComponent } from './data-form/data-form.component';
import { Auth, user } from '@angular/fire/auth';

@Component({
    selector: 'app-firestore',
    standalone: true,
    imports: [CommonModule, DataFormComponent],
    templateUrl: './firestore.component.html',
    styleUrls: ['./firestore.component.scss']
})
export class FirestoreComponent implements OnInit {
    users$: Observable<any>;

    // User data
    private userDataSubject = new BehaviorSubject<any | null>(null);
    userData$ = this.userDataSubject.asObservable();

    dataForm!: FormGroup
    // Authenticated user
    private auth: Auth = inject(Auth);
    user$ = user(this.auth);

    constructor(private firestore: Firestore, private fb: FormBuilder) {
        const usersCollection = collection(this.firestore, 'users');
        this.users$ = collectionData(usersCollection);
    }

    ngOnInit(): void {
        // Get the user's data from the users collection
        const uuid = this.user$.subscribe((user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // User interface: https://firebase.google.com/docs/reference/js/auth.user
                const uid = user.uid;
                console.log('uid for fetching user data is', uid);
                // Get the user's data from the users collection
                getDoc(doc(this.firestore, 'users', uid))
                    .then((doc) => {
                        if (doc.exists()) {
                            this.userDataSubject.next(doc.data()); // Set doc.data() to userData$
                        } else {
                            console.log("No such document!");
                        }
                    }).catch((error) => {
                        console.log("Error getting document:", error);
                    });
                // // use this to add example user data to this user
                //this.populateNewUserData(uid);
            } else {
                console.log('user is not signed in');
            }
        });
    }

    populateNewUserData(uid: string) {
        // addDoc to this user's userData
        addDoc(collection(this.firestore, 'users', uid, 'userData'), {
            movies: ['movie1', 'movie2', 'movie3']
        });
    }
}