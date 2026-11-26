import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateShortUrlRequest, ShortUrlResponse } from '../models/short-url.model';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UrlShortenerService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/short-urls';

  urls = signal<ShortUrlResponse[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  createShortUrl(request: CreateShortUrlRequest): Observable<ShortUrlResponse> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.post<ShortUrlResponse>(this.apiUrl, request).pipe(
      tap({
        next: (response) => {
          this.urls.update((list) => [response, ...list]);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Failed to shorten URL');
          this.loading.set(false);
        },
      })
    );
  }

  loadUrls(): void {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<ShortUrlResponse[]>(this.apiUrl).subscribe({
      next: (urls) => {
        this.urls.set(urls);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to load URLs');
        this.loading.set(false);
      },
    });
  }
}
