import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UrlShortenerService } from '../../services/url-shortener.service';
import { AuthService } from '../../services/auth.service';
import { ShortUrlResponse } from '../../models/short-url.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  form: FormGroup;
  result = signal<ShortUrlResponse | null>(null);
  copied = signal(false);
  ttlHours = signal(1);

  constructor(
    private fb: FormBuilder,
    public urlService: UrlShortenerService,
    public authService: AuthService,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      longUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
    });
  }

  ngOnInit(): void {
    this.http.get<{ anonymousTtlHours: number }>('http://localhost:8080/api/v1/short-urls/config')
      .subscribe(config => this.ttlHours.set(config.anonymousTtlHours));
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.result.set(null);
    this.copied.set(false);
    this.urlService.createShortUrl({ longUrl: this.form.value.longUrl }).subscribe({
      next: (response) => this.result.set(response),
      error: () => {},
    });
  }

  copyToClipboard(): void {
    const url = this.result()?.shortUrl;
    if (url) {
      navigator.clipboard.writeText(url).then(() => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
      });
    }
  }
}
