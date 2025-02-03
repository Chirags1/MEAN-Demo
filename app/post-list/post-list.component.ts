import { NgFor, NgIf } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { Post } from '../post.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    MatExpansionModule,
    NgFor,
    NgIf,
    MatButtonModule,
    HttpClientModule,
    RouterLink,
  ],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit {
  constructor() {}
  private http = inject(HttpClient);
  @Input() postList: Post[] = [];
  backendPost: Post[] = [];

  ngOnInit() {
    this.getPost();
  }
  getPost() {
    this.http
      .get<{ message: string; post: Post[] }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) => {
          return postData.post.map((po) => {
            return {
              title: po.title,
              content: po.content,
              _id: po._id,
            };
          });
        })
      )
      .subscribe((transformedposts) => {
        this.backendPost = transformedposts;
      });
    console.log(this.postList);
  }

  onDelete(id: string) {
    console.log(id);
    this.http
      .delete(`http://localhost:3000/api/post/delete/${id}`)
      .subscribe((res) => {
        const updatedPost = this.backendPost.filter((post) => post._id !== id);
        this.backendPost = updatedPost;
      });
  }
}
