import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DocumentData, Firestore, QuerySnapshot, addDoc, collection, collectionData, doc, getDoc, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-data-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DataFormComponent],
    templateUrl: './data-form.component.html',
    styleUrls: ['./data-form.component.scss']
})
export class DataFormComponent implements OnInit {
    item$: Observable<any>;
    dataForm!: FormGroup

    constructor(private firestore: Firestore, private fb: FormBuilder) {
        // Item Collection
        const itemCollection = collection(this.firestore, 'test');
        this.item$ = collectionData(itemCollection);
    }

    ngOnInit(): void {
        this.setUpForms();
    }

    setUpForms() {
        this.dataForm = this.fb.group({
            text: ['', Validators.required]
        });
    }

    addData() {
        // Test Collection (Item Collection is inside the Constructor)
        const testCollection = collection(this.firestore, 'test');
        addDoc(testCollection, { 'text': this.dataForm.value.text }).then((docRef) => {
            console.log('Document written with ID: ', docRef.id);
        });
    }

    submitDataForm() {
        // console.log(this.dataForm.value);
        this.addData();
    } 
}