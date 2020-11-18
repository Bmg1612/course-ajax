(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        const imgRequest = new XMLHttpRequest();
        imgRequest.onload = addImage;
        imgRequest.onerror = function (err) {
            requestError(err, 'image');
        };
        imgRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        imgRequest.setRequestHeader('Authorization', 'Client-ID v5FFgYLlEp9xyUOiZVrjtJGfwov_MXDs3WcWqCV52Fo');
        imgRequest.send();

        const articleRequest = new XMLHttpRequest();
        articleRequest.onload = addArticles;
        articleRequest.onerror = function (err) {
            requestError(err, 'articles');
        };
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=TPLAvw7mn3TFohV8AgfAj4SoxWhuPkQz`);
        articleRequest.send();
    
    });

    function addImage(){
        let htmlContent = '';
        let data = JSON.parse(this.responseText);
        console.log(data)
    
        if(data && data.results && data.results[0]) {
        const firstImage = data.results[0];
    
        htmlContent = `<figure>
        <img src="${firstImage.urls.regular}" alt="${searchedForText}">
        <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
        </figure>`;
    } else {
        htmlContent = '<div class="error-no-image">No images available</div>';
    }
    
        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    };
    
    function addArticles () {
        let htmlContent = '';
        let data = JSON.parse(this.responseText);
    
        if(data.response && data.response.docs && data.response.docs.length > 1) {
            htmlContent = '<ul>' + data.response.docs.map(article => `<li class="article">
            <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
            <p>${article.snippet}</p>
            </li>`
        ).join('') + '</ul>'
    } else {
        htmlContent = '<div class="error-no-articles">No articles available</div>';
    }
    
        responseContainer.insertAdjacentHTML('beforeend', htmlContent);
    };
})();

