import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, addDoc, CollectionReference, DocumentReference, getDoc, doc, getDocs, onSnapshot, deleteDoc } from '@angular/fire/firestore';
import { Auth, UserProfile, user } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Review, Movie } from '../models/models';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-your-movies',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './your-movies.component.html',
  styleUrls: ['./your-movies.component.scss']
})
export class YourMoviesComponent {
  private firestore: Firestore = inject(Firestore); // inject Cloud Firestore
  users$: Observable<UserProfile[]>;
  reviewsCollection!: CollectionReference;
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  uid!: string;
  allReviews: Review[] = [];

  constructor() {
    const userProfileCollection = collection(this.firestore, 'users');
    this.users$ = collectionData(userProfileCollection) as Observable<UserProfile[]>;
  }

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      if (user) {
        this.uid = user.uid;
        if (!this.uid) {
          console.error('user uid is empty');
          return;
        }

        const reviewsCollection = collection(this.firestore, 'users', this.uid, 'reviews');

        onSnapshot(reviewsCollection, (querySnapshot) => {
          this.allReviews = [];
          querySnapshot.forEach((doc) => {
            console.log('doc.id:', doc.id);
            const reviewItem: Review = doc.data() as Review;
            reviewItem.id = doc.id;
            this.allReviews.unshift(reviewItem);
          });
          console.log('allReviews:', this.allReviews);
        });
      }
    });
  }

  // For aligning stars on the right side of Reviews
  getStarPositions(rating: number): number[] {
    return Array.from({ length: rating }, (_, i) => 30 + i * 30);
  }

  // onAddReview(review: Review): void {
  //   console.log('onAddReview:', review);
  //   addDoc(collection(this.firestore, 'users', this.uid, 'reviews'), review).then((docRef: DocumentReference) => {
  //     console.log('Document written with ID: ', docRef.id);
  //   }
  //   ).catch((error) => {
  //     console.error('Error adding review document: ', error);
  //   });
  // }

}
