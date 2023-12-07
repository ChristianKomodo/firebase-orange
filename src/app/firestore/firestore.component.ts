import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DocumentData, Firestore, QuerySnapshot, addDoc, collection, collectionData, doc, getDoc, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DataFormComponent } from './data-form/data-form.component';

@Component({
    selector: 'app-firestore',
    standalone: true,
    imports: [CommonModule, DataFormComponent],
    templateUrl: './firestore.component.html',
    styleUrls: ['./firestore.component.scss']
})
export class FirestoreComponent implements OnInit {
    item$: Observable<any>;
    dataForm!: FormGroup

    constructor(private firestore: Firestore, private fb: FormBuilder) {
        const itemCollection = collection(this.firestore, 'test');
        this.item$ = collectionData(itemCollection);
    }

    ngOnInit(): void {
        const testCollection = collection(this.firestore, 'test');

        const oneDoc = getDoc(doc(testCollection, '0HWz1JXqvJ5DhhTr6rGy')).then((doc) => {
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
                console.log('doc.id and doc.data()');
                console.log(doc.id, ' => ', doc.data());
            });
        });
    }
}