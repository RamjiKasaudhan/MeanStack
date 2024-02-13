import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub!: Subscription;
  public isLoading: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  totalPosts = 0;
  postPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthencated = false;
  userId!: string;
  private authListenerSubs!: Subscription;

  constructor(private postsService: PostsService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService
      .getPostUpdateListner()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
    this.userIsAuthencated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthencated => {
      this.userId = this.authService.getUserId();
      this.userIsAuthencated = isAuthencated;
    });
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      if (this.currentPage > 1 && this.posts.length == 1) {
        this.currentPage--;
        this.paginator.pageIndex = this.currentPage - 1;
        this.paginator._changePageSize(this.paginator.pageSize);
      } else {
        this.postsService.getPosts(this.postPerPage, this.currentPage);
      }
    });
    this.isLoading = true;

  }

  onChangedPage(pageEvent: PageEvent) {
    console.log(pageEvent);
    this.isLoading = true;
    this.currentPage = pageEvent.pageIndex + 1;
    this.postPerPage = pageEvent.pageSize;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }
}
