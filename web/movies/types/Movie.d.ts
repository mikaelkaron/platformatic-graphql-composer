/**
 * Movie
 * A Movie
 */
declare interface Movie {
    id?: string;
    directorId?: string | null;
    title: string;
    year?: number | null;
}
export { Movie };
