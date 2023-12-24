export interface UserData {
	uid: string;
	email: string;
	displayName?: string;
	photoURL?: string;
	movies?: any;
}

export interface Movie {
	id: string;
	showButton: any;
	Poster: string;
	Title: string;
	Type: string;
	Year: number;
	imdbID: string;
	// Below are properties from a call to Details
	Director?: string;
	Plot?: string;
	Actors?: string;
	Awards?: string;
	Ratings: { Source: string; Value: string; }[];
	totalSeasons?: string;
	Genre?: string;
	Writer?: string;
}

export interface MovieSearchResult {
	Response: string;
	Search: Array<Movie>;
	totalResults: string;
}