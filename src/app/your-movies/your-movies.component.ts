import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

interface UserProfile {
  email: string;
}

@Component({
  selector: 'app-your-movies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './your-movies.component.html',
  styleUrls: ['./your-movies.component.scss']
})
export class YourMoviesComponent {
  private firestore: Firestore = inject(Firestore); // inject Cloud Firestore
  users$: Observable<UserProfile[]> | undefined;

  constructor() {
    // get a reference to the user-profile collection
    const userProfileCollection = collection(this.firestore, 'users');

    // get documents (data) from the collection using collectionData
    this.users$ = collectionData(userProfileCollection) as Observable<UserProfile[]>;
  }

}
