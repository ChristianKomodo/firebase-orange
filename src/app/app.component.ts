import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DocumentData, Firestore, QuerySnapshot, addDoc, collection, collectionData, doc, getDoc, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

interface Item {
  text: string
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
  <ul>
    <li *ngFor="let item of item$ | async">
      {{ item.text }}
    </li>
  </ul>
  `
})
export class AppComponent implements OnInit {
  // item$: Observable<Item[]>;
  // item$ = collectionData<Item[]>(itemCollection);
  item$: Observable<any>;

  constructor(private firestore: Firestore) {
    const itemCollection = collection(this.firestore, 'test');
    this.item$ = collectionData(itemCollection);
  }

  ngOnInit(): void {
    const testCollection = collection(this.firestore, 'test');

    // Add a document with an auto-generated id
    addDoc(testCollection, { 'text': 'first one' }).then((docRef) => {
      console.log('Document written with ID: ', docRef.id);
    });

    const oneDoc = getDoc(doc(testCollection, 'Y1O7RCJcpKwPJ0b28w2o')).then((doc) => {
      if (doc.exists()) {
        console.log('Document data:', doc.data());
      } else {
        // if doc.data() is undefined
        console.log('No such document!');
      }
    });
    console.log('oneDoc', oneDoc);

    const docs = getDocs(testCollection);
    docs.then((docs: QuerySnapshot<DocumentData>) => {
      docs.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data());
      });
    });

  }
}
