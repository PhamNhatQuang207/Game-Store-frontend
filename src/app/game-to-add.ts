export interface GameToAdd {
    name: string;
    genreId: string; // API expects genreId as a string
    releaseDate: string; // API expects date as string in ISO format (YYYY-MM-DD)
    price: number;
}
