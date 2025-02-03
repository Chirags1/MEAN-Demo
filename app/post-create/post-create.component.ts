import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Post } from '../post.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
  ],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css',
})
export class PostCreateComponent implements OnInit {
  http = inject(HttpClient);
  route = inject(ActivatedRoute);
  title = '';
  content = '';
  private mode = 'create';
  private postId: any;
  post: Post;
  id = '1';
  constructor() {
    this.post = {
      _id: '',
      title: '',
      content: '',
    };
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        //this.post=this.Post.find(p=>p.id===postId);
        this.post.title = this.title;
        this.post.content = this.content;
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
  @Output() postData = new EventEmitter<Post>();
  onSubmit() {
    let post: Post = {
      _id: null,
      title: this.title,
      content: this.content,
    };
    this.postData.emit(post);
    this.http
      .post<{ message: string; postId: string }>(
        'http://localhost:3000/api/post',
        post
      )
      .subscribe((message) => {
        const PostId = message.postId;
        post._id = PostId;
        console.log(message);
      });
    this.title = '';
    this.content = '';
  }
}
