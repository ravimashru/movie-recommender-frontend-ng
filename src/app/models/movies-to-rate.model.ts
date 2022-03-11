export interface MoviesToRate {
  movies: Array<Movie>;
}

export interface Movie {
  id: number;
  title: string;
  thumbnail_url: string;
}
