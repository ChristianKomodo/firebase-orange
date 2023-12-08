import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DocumentData, Firestore, QuerySnapshot, addDoc, collection, collectionData, doc, getDoc, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
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
    userData$!: Observable<any>;
    userDisplayData: any;
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
        // First get the current user's UID
        const uuid = this.user$.subscribe((user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // User interface: https://firebase.google.com/docs/reference/js/auth.user
                const uid = user.uid;
                console.log('uid for fetching user data is', uid);
                // Get the user's data from the users collection
                getDoc(doc(this.firestore, 'users', uid)).then((doc) => {
                    if (doc.exists()) {
                        console.log('Document data:', doc.data());
                        this.userData$ = doc.data();
                        // this.displayData(doc.data());
                    } else {
                        // if doc.data() is undefined
                        console.log('No documents for this user!');
                    }
                });
            } else {
                console.log('user is not signed in');
            }
        });
        // const userData = getDoc
    }

    displayData(data: any) {
        console.log('user data:', data.userData);
        this.userDisplayData = data.userData;
    }
}