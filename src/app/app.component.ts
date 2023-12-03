import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'firebase-orange';

  constructor(private firestore: Firestore) { }

  ngOnInit(): void {
    const testCollection = collection(this.firestore, 'test');
    addDoc(testCollection, {'text': 'Love it or hate it'});
  }
}
