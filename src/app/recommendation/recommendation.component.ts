import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import { CollectionReference, DocumentReference, Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';

interface Recommendation {
  title: string;
  text: string;
}

@Component({
  selector: 'app-recommendation',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
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
  lockdown: boolean = true;

  constructor(private http: HttpClient, private firestore: Firestore) { }

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
    // if there are more than 10, then lock-down the site
    // if there are less than 10, then add a new item
    this.recommendation$.subscribe((recommendations: Recommendation[]) => {
      console.log('recommendations', recommendations);
      this.recommendationCount = recommendations.length;
      if (recommendations.length > 50) {
        this.lockdown = true;
      } else {
        this.lockdown = false;
      }
    });
  }

  checkForProfanity(text: string): Observable<any> {
    const url = 'https://api.api-ninjas.com/v1/profanityfilter?text=' + text;
    const headers = { 'X-Api-Key': 'tUpeFlLpeuDeggYnt0fZGQ==nXuLoLqSYw6JWHTK' };
    return this.http.get(url, { headers });
    // Sample response:
    // {
    //   "original": "damn it!",
    //   "censored": "**** it!",
    //   "has_profanity": true
    // }
  }

  addRecommendation() {
    this.lockdownCheck();
    if (this.lockdown) {
      console.log('The site is in lockdown mode from too many submissions.');
      return;
    }
    if (this.title.nativeElement.value === '' || this.text.nativeElement.value === '') {
      console.log('Please enter a title and text');
      return;
    }
    let recommendation = {
      title_raw: this.title.nativeElement.value,
      text_raw: this.text.nativeElement.value,
      title: '',
      text: '',
    };
    console.log('recommendation', recommendation);

    this.checkForProfanity(recommendation.title_raw).pipe(
      map((result: any) => {
        recommendation.title = result.censored;
        return recommendation;
      }),
      switchMap(() => this.checkForProfanity(recommendation.text_raw)),
      map((result: any) => {
        recommendation.text = result.censored;
        return recommendation;
      })
    ).subscribe({
      next: recommendation => {
        addDoc(this.recommendationCollection, recommendation).then((documentReference: DocumentReference) => {
          console.log('Recommendation recorded. "documentReference" is:', documentReference);
        });
      },
      error: error => {
        console.error('Error: ', error);
      }
    });

    // addDoc(this.recommendationCollection, recommendation).then((documentReference: DocumentReference) => {
    //   console.log('Recommendation recorded. "documentReference" is:', documentReference);
    // });
  }
}

