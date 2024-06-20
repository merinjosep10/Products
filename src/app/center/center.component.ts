import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IProduct } from './todo';
import { ReactiveFormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-center',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    NgIf,
    CommonModule,
    HttpClientModule,
  ],
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.css'],
})
export class CenterComponent implements OnInit {
  products: IProduct[] = [];
  trackById(index: number, product: IProduct) {
    return product.id;
  }
  productToEdit!: number;
  AddForm!: FormGroup;
  EditForm!: FormGroup;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.AddForm = new FormGroup({
      newproduct: new FormControl(null),
      newproductprice: new FormControl(null),
    });
    this.EditForm = new FormGroup({
      editproduct: new FormControl(null),
      editproductprice: new FormControl(null),
    });
    this.loadProducts();
  }
  loadProducts() {
    this.http
      .get<IProduct[]>('https://addproduct.free.beeceptor.com/api/products')
      .subscribe((data: IProduct[]) => {
        this.products = data;
      });
  }
  onSubmit() {
    const product = {
      name: this.AddForm.get('newproduct')?.value,
      price: this.AddForm.get('newproductprice')?.value,
    };

    console.table(this.products);
    this.http
      .post<IProduct>(
        'https://addproduct.free.beeceptor.com/api/products',
        product
      )
      .subscribe(() => {
        this.AddForm.reset();
        this.loadProducts();
      });
  }
  delete_product(i: number) {
    this.http
      .delete(`https://addproduct.free.beeceptor.com/api/products/${i}`)
      .subscribe(() => {
        console.table(this.products);
        this.loadProducts();
      });
  }
  edit_product() {
    const i = this.productToEdit;
    const product: IProduct | undefined = this.products.find(
      (obj) => obj.id === i
    );
    if (product) {
      product.name = this.EditForm.get('editproduct')?.value;
      product.price = this.EditForm.get('editproductprice')?.value;
    }
    this.http
      .put(`https://addproduct.free.beeceptor.com/api/products/${i}`, product)
      .subscribe(() => {
        console.log(product);
        this.EditForm.reset();
        this.loadProducts();
      });
  }

  editButtonClicked(product: IProduct) {
    this.productToEdit = product.id;
    this.EditForm.setValue({
      editproduct: product.name,
      editproductprice: product.price,
    });
  }
}
