import React, { useState, useEffect } from "react";
import logo from "../../assets/analizsinemalogo 1.png";
import "./Home.scss";
import { Pagination } from "@mui/material";

interface Movie {
  id: number;
  poster_path: string;
  original_title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  video: true;
}

function Home() {
  const [feelingText, setFeelingText] = useState("");
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await getMovieRecommendation(currentPage);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  fetch("http://localhost:8000/predict_sentiment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: "Bu yorumun duygusunu analiz edin." }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Öngörülen duygu:", data.sentiment);
    })
    .catch((error) => {
      console.error("Hata:", error);
    });

  const getMovieRecommendation = async (page: number) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=831f52dcd04971e2e72da67251a15532&page=${page}&_t=${Date.now()}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const json = await response.json();

      const totalMovies = 100;
      const moviesPerPage = 20;
      const totalPagesCalculated = Math.ceil(totalMovies / moviesPerPage);

      setTotalPages(totalPagesCalculated);
      setMovieList(json.results);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setError(error);
    }
  };
  return (
    <>
      <div className="container">
        <div className="navbar">
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="menu">
            <li>Ana Sayfa</li>
            <li>Hakkında</li>
            <li>İletişim</li>
          </div>
        </div>
        <div className="search">
          <input
            type="text"
            value={feelingText}
            onChange={(e) => setFeelingText(e.target.value)}
            placeholder="Duygunuzu yazın..."
            id="search-input"
          />
        </div>
        <div className="film-container">
          {movieList
            .slice((currentPage - 1) * 20, (currentPage - 1) * 20 + 20)
            .map((movie: Movie) => (
              <div key={movie.id} className="cards" style={{ height: "930px" }}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  style={{
                    width: "100%",
                    borderTopRightRadius: "12px",
                    borderTopLeftRadius: "12px",
                  }}
                ></img>
                <div className="movie-details">
                  <div className="movie-title">{movie.original_title}</div>
                  <div className="movie-overview">{movie.overview}</div>
                  <div className="movie-release-date">
                    Tarih: {movie.release_date}
                  </div>
                  <div className="movie-popularity">
                    IMDB: {movie.vote_average}
                  </div>
                  <div className="movie-video">{movie.video}</div>
                </div>
              </div>
            ))}
        </div>
        <Pagination
          sx={{ display: "flex", justifyContent: "center", marginTop: "64px" }}
          count={totalPages}
          page={currentPage}
          onChange={(event, newPage) => setCurrentPage(newPage)}
          color="primary"
        />
        <div className="footer">
          <div className="footer-logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="footer-nav">
            <h4>Hızlı Menü</h4>
            <div className="footer-menus">
              <li>Ana Sayfa</li>
              <li>Hakkımızda</li>
              <li>İletişim</li>
            </div>
          </div>
          <div className="message">
            <h3>Şikayet ve önerileriniz için</h3>
            <input type="text" placeholder="Mesaj Giriniz.." />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
