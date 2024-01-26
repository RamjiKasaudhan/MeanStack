import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from 'rxjs';

import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {

    posts: Post[] = [];
    private postsSub!: Subscription;
    public isLoading: boolean = false;

    constructor(private postsService: PostsService) { }

    ngOnInit() {
        this.isLoading=true;
        this.postsService.getPosts();
        this.postsSub = this.postsService.getPostUpdateListner()
            .subscribe((post: Post[]) => {
                this.posts = post;
                this.isLoading=false;
            })
    }

    onDelete(postId: string) {
        this.postsService.deletePost(postId);
    }

    ngOnDestroy() {
        this.postsSub.unsubscribe();
    }
}