export interface ShortUrlResponse {
  id: number;
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  createdAt: string;
  expiresAt: string | null;
}

export interface CreateShortUrlRequest {
  longUrl: string;
  expiresAt?: string | null;
}
