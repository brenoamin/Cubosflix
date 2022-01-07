const movies = document.querySelector(".movies");
const title = document.querySelector(".movie__title");
const movieInfo = document.querySelector(".movie__info");
const btnPrev = document.querySelector("img.btn-prev");
const btnPost = document.querySelector("img.btn-next");
const input = document.querySelector(".input");
const videoDay = document.querySelector(".highlight__video");
const titleDay = document.querySelector(".highlight__title");
const averageDay = document.querySelector(".highlight__rating");
const genreDay = document.querySelector(".highlight__genres");
const releaseDay = document.querySelector(".highlight__launch");
const paragraphDay = document.querySelector(".highlight__description");
const linkDay = document.querySelector("a.highlight__video-link");
const modalHidden = document.querySelector("div.hidden");
const modalTitle = document.querySelector(".modal__title");
const modalImage = document.querySelector(".modal__img");
const modalparagraph = document.querySelector(".modal__description");
const modalRating = document.querySelector(".modal__average");
const modalGenero = document.querySelector(".modal__genres");
let filmes = [];
const fetchDataMovies = async () => {
  const response = await fetch(
    "https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false"
  );
  const data = await response.json();
  filmes = data.results;
  criarGaleria();
};
const fetchHighlight = async () => {
  const response = await fetch(
    "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR"
  );

  const data = await response.json();
  videoDay.style.backgroundImage = `url(${data.backdrop_path})`;
  titleDay.innerHTML = data.title;
  averageDay.innerHTML = data.vote_average.toFixed(1);
  genreDay.textContent = data.genres.map((n) => n.name).join(", ");
  releaseDay.textContent = new Date(data.release_date).toLocaleDateString(
    "pt-br",
    { year: "numeric", month: "long", day: "numeric" }
  );
  paragraphDay.textContent = data.overview;
};
const fetchHighlightVideo = async () => {
  const response = await fetch(
    "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR"
  );
  const data = await response.json();
  linkDay.href = `https://www.youtube.com/watch?v=${data.results[0].key}`;
};
const fetchFilterMovies = async (value) => {
  const response = await fetch(
    `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${value}`
  );
  const data = await response.json();
  if (data.results.length === 0) {
    fetchDataMovies();
    return;
  }
  filmes = data.results;
  criarGaleria();
};

btnPrev.addEventListener("click", btnVoltar);
btnPost.addEventListener("click", btnNext);

let pagina = 0;
const minimoPagina = 0;
const maximoPagina = 15;
function btnVoltar() {
  pagina === 0 ? (pagina = maximoPagina) : (pagina -= 5);
  criarGaleria();
}
function btnNext() {
  pagina === maximoPagina ? (pagina = minimoPagina) : (pagina += 5);
  criarGaleria();
}

input.addEventListener("keydown", function (event) {
  if (event.key !== "Enter") return;
  pagina = 0;
  if (input.value === "") {
    fetchDataMovies();
  } else {
    fetchFilterMovies(input.value);
  }
  input.value = "";
});

function criarGaleria() {
  movies.innerHTML = "";
  for (let i = pagina; i < pagina + 5; i++) {
    const dados = filmes[i];
    if (!dados) return;
    const movieDiv = document.createElement("div");
    movieDiv.classList.add("movie");
    movieDiv.style.backgroundImage = `url(${dados.poster_path})`;
    const infoDiv = document.createElement("div");
    infoDiv.classList.add("movie__info");
    movieDiv.append(infoDiv);

    const titleSpan = document.createElement("span");
    titleSpan.classList.add("movie__title");
    titleSpan.textContent = dados.title;
    titleSpan.title = dados.title;
    infoDiv.append(titleSpan);

    const ratingSpan = document.createElement("span");
    ratingSpan.classList.add("movie__rating");
    ratingSpan.prepend(dados.vote_average);
    infoDiv.append(ratingSpan);
    const starImage = document.createElement("img");
    starImage.src = "./assets/estrela.svg";
    starImage.alt = "Estrela";
    ratingSpan.append(starImage);
    movies.append(movieDiv);
    movieDiv.addEventListener("click", async () => {
      modalHidden.classList.remove("hidden");
      modalHidden.style.display = "flex";
      const response = await fetch(
        `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${dados.id}?language=pt-BR`
      );
      const data = await response.json();
      modalGenero.innerHTML = "";
      modalTitle.innerHTML = data.title;
      modalImage.src = data.backdrop_path;
      modalparagraph.innerHTML = data.overview;
      modalRating.innerHTML = data.vote_average.toFixed(1);
      data.genres.forEach((genero) => {
        const spanGenre = document.createElement("span");
        spanGenre.classList.add("modal__genre");
        spanGenre.textContent = genero.name;
        modalGenero.append(spanGenre);
      });
    });
    modalHidden.addEventListener("click", () => {
      modalHidden.classList.add("hidden");
      modalHidden.style.display = "none";
    });
  }
}

fetchDataMovies();
fetchHighlight();
fetchHighlightVideo();
