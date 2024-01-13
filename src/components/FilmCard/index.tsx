import React from "react";

type FilmProps = {
  movie: any;
};
const MovieCard: React.FC<FilmProps> = ({ movie }) => {
  return (
    <div className="film-card">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="film-resim"
      />

      <div className="film-info">
        <h3 className="film-title">{movie.title}</h3>
        <p className="film-desc">{movie.overview}</p>
      </div>
    </div>
  );
};

export default MovieCard;
