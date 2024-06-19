import { Component , OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {IProduct } from './todo';
import { ReactiveFormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-center',
  standalone: true,
  imports:[FormsModule,ReactiveFormsModule,NgFor,NgIf,CommonModule],
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.css']
})

export class CenterComponent implements OnInit{
  products :IProduct[]=[];
  productToEdit: number;
  AddForm!:FormGroup;
  EditForm! : FormGroup;
  constructor()
  {
    this.productToEdit=0;
  }

  ngOnInit(): void {
    this.AddForm=new FormGroup({
      'newproduct':new FormControl(null),
      'newproductprice':new FormControl(null)
    });
    this.EditForm=new FormGroup({
      'editproduct':new FormControl(null),
      'editproductprice':new FormControl(null)
    });
    this.loadProducts();
  }
  loadProducts(){
    const productsJson = localStorage.getItem('products');
    if (productsJson) {
      this.products = JSON.parse(productsJson);
    }
  }
  onSubmit()
  {
    const product = {
      name: this.AddForm.get('newproduct')?.value,
      price: this.AddForm.get('newproductprice')?.value,
      id: new Date().getTime()
  }
  this.products.push(product)
  this.AddForm.reset();
  console.table(this.products)
  localStorage.setItem('products',JSON.stringify(this.products));
  }
  delete_product(i:number)
  {
    this.products = this.products.filter(obj => obj.id !== i);
    console.table(this.products);
    localStorage.setItem('products',JSON.stringify(this.products));
  }
  edit_product()
  {
    const i = this.productToEdit;
    for (let object of this.products) {
      if (object.id === i) {
          object.name = this.EditForm.get('editproduct')?.value,
          object.price = this.EditForm.get('editproductprice')?.value,
          console.log(object.id)
      }
  }
  localStorage.setItem('products',JSON.stringify(this.products));
  }

  editButtonClicked(i: number) {
    this.productToEdit = i;
    this.EditForm.setValue({
      editproduct: this.products.find(obj => obj.id === i)?.name || '',
      editproductprice: this.products.find(obj => obj.id === i)?.price||0
    });
  }
}
