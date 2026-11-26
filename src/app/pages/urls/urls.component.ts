import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UrlShortenerService } from '../../services/url-shortener.service';

@Component({
  selector: 'app-urls',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './urls.component.html',
  styleUrl: './urls.component.scss',
})
export class UrlsComponent implements OnInit {
  copiedCode = signal<string | null>(null);

  constructor(public urlService: UrlShortenerService) {}

  ngOnInit(): void {
    this.urlService.loadUrls();
  }

  copyUrl(shortUrl: string, shortCode: string): void {
    navigator.clipboard.writeText(shortUrl).then(() => {
      this.copiedCode.set(shortCode);
      setTimeout(() => this.copiedCode.set(null), 2000);
    });
  }

  isExpired(expiresAt: string | null): boolean {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  }
}
