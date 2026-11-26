export interface TopUrlResponse {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  clickCount: number;
}

export interface DashboardResponse {
  totalUrls: number;
  topUrls: TopUrlResponse[];
}
