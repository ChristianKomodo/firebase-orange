import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { CollectionReference, DocumentData, DocumentReference, Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';

interface Recommendation {
  title: string;
  text: string;
}

@Component({
  selector: 'app-recommendation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.scss']
})
export class RecommendationComponent implements OnInit {
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  recommendation$!: Observable<Recommendation[]>;
  recommendationCollection!: CollectionReference;
  recommendationCount!: number;
  @ViewChild('title') title!: ElementRef;
  @ViewChild('text') text!: ElementRef;
  lockdown: boolean = false;

  constructor(private firestore: Firestore) { }

  ngOnInit() {
    // get a reference to the recommendation collection
    this.recommendationCollection = collection(this.firestore, 'recommendation');

    // get documents (data) from the collection using collectionData
    this.recommendation$ = collectionData(this.recommendationCollection) as Observable<Recommendation[]>;
    // do a check to see if we are in lockdown mode because of spamming
    this.lockdownCheck();
  }

  lockdownCheck() {
    // Checking to see if someone is spamming the site
    // count the number of items in the "recommendation" collection
    // if there are more than 10, then lockdown the site
    // if there are less than 10, then add a new item
    this.recommendation$.subscribe((recommendations: Recommendation[]) => {
      console.log('recommendations', recommendations);
      this.recommendationCount = recommendations.length;
      if (recommendations.length > 10) {
        this.lockdown = true;
      } else {
        this.lockdown = false;
      }
    });
  }

  addRecommendation() {
    this.lockdownCheck();
    if (this.lockdown) {
      console.log('The site is in lockdown mode from too many submissions.');
      return;
    }
    const recommendation = {
      title: this.title.nativeElement.value,
      text: this.text.nativeElement.value
    };
    console.log('recommendation', recommendation);
    if (recommendation.title === '' || recommendation.text === '') {
      console.log('Please enter a title and text');
      return;
    }
    addDoc(this.recommendationCollection, recommendation).then((documentReference: DocumentReference) => {
      // the documentReference provides access to the newly created document
      console.log('Recommendation recorded. "documentReference" is:', documentReference);
    });
  }
}

