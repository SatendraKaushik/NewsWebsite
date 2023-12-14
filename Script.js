const API_KEY = "da1c0932e298492eae092470c0a2a900";
const url = "https://newsapi.org/v2/everything?q=";
const API_KEY_WEATHER = "cc7c736bd37760b389467b5ffd85a0c1";

function getWeatherData(lat, lon) {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY_WEATHER}&units=metric`);
}

function displayWeather(data) {
    const weatherContainer = document.getElementById("weather-container");
    const weatherContent = `
        <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="Weather Icon">
        <p>${data.main.temp}°C</p>
    `;

    weatherContainer.innerHTML = weatherContent;
}

async function fetchWeather() {
    if (navigator.geolocation) {
        try {
            const position = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const weatherData = await getWeatherData(lat, lon);
            displayWeather(await weatherData.json());
        } catch (error) {
            console.error("Error fetching weather:", error);
        }
    }
}

window.addEventListener("load", () => {
    fetchNews("India");
    fetchWeather();
});

async function fetchNews(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    bindData(data.articles);
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});

// Slider
const searchTerm = "world";

async function getNewsData() {
    try {
        const response = await fetch(`${url}${searchTerm}&apiKey=${API_KEY}`);
        const data = await response.json();
        return data.articles;
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}

async function displaySlides() {
    const slider = document.getElementById("slider");
    const newsData = await getNewsData();

    slider.innerHTML = "";

    newsData.forEach((article, index) => {
        const slide = document.createElement("div");
        slide.classList.add("slide");

        const content = `
            <div class="slide-content">
                <h3>${article.title}</h3>
                <p>${article.description}</p>
                <a href="${article.url}" target="_blank">Read more</a>
            </div>
            <img src="${article.urlToImage}" alt="${article.title}">
        `;

        slide.innerHTML = content;
        slider.appendChild(slide);
    });

    let currentSlide = 0;

    // Auto-scroll the slider
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slider.children.length;
        slider.style.transition = "transform 0.5s ease-in-out";
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }, 5000);
}

displaySlides();
