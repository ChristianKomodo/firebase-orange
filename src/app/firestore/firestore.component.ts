import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, doc, getDoc, setDoc } from '@angular/fire/firestore';
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
                            console.log("Found UserData Document:", doc.data());
                            this.userDataSubject.next(doc.data()); // Set doc.data() to userData$
                        } else {
                            console.log("No such document!");
                        }
                    }).catch((error) => {
                        console.log("Error getting document:", error);
                    });
                // // use this to add example user data to this user
                // this.updateUserData(uid);
            } else {
                console.log('user is not signed in');
            }
        });
    }

    updateUserData(uid: string) {
        const userDoc = doc(this.firestore, 'users', uid);
        const userData = {
            moviez: ['Toy Story 1', 'Toy Story 2', 'Toy Story 3']
        };
        setDoc(userDoc, userData, { merge: true }).then(() => {
            console.log('User data updated');
        }).catch((error) => {
            console.error('Error updating user data:', error);
        });
    }
}