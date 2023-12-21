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
}

export interface MovieSearchResult {
	Response: string;
	Search: Array<Movie>;
	totalResults: string;
}