<script>

	
let suggestions = [];

// Load suggestions from the file
fetch('suggestions.txt') 
    .then(response => response.text())
    .then(data => {
        suggestions = data.split('\n').map(item => item.trim()).filter(item => item);
    });

function showSuggestions(input) {
    const suggestionBox = document.getElementById('mobile-suggestions');
    suggestionBox.innerHTML = '';
    const inputValue = input.value.toLowerCase();
    const filteredSuggestions = suggestions.filter(suggestion => suggestion.toLowerCase().includes(inputValue));
    if (filteredSuggestions.length > 0) {
        suggestionBox.style.display = 'block';
        suggestionBox.style.top = `${input.getBoundingClientRect().bottom + window.scrollY}px`;
        filteredSuggestions.forEach((suggestion, index) => {
            const suggestionItem = document.createElement('div');
            suggestionItem.classList.add('suggestion-item');
            suggestionItem.dataset.index = index;
            suggestionItem.textContent = suggestion;
            suggestionItem.onclick = () => {
                input.value = suggestion;
                searchWiki(suggestion);
                suggestionBox.style.display = 'none';
            };
            suggestionBox.appendChild(suggestionItem);
        });
    } else {
        suggestionBox.style.display = 'none';
    }
}

document.getElementById('mobile-searchbar').addEventListener('input', function() {
    showSuggestions(this);
});

document.addEventListener('click', function(event) {
    const suggestionBox = document.getElementById('mobile-suggestions');
    if (!suggestionBox.contains(event.target) && event.target.id !== 'mobile-searchbar') {
        suggestionBox.style.display = 'none';
    }
});

function searchWiki(query) {
    if (!query || query.trim() === "") return; 
    document.getElementById("iframe").src = `https://bindingofisaacrebirth.fandom.com/wiki/Special:Search?search=${encodeURIComponent(query)}&go=Search`;
    document.getElementById("mobile-searchbar").value = ''; 
    document.getElementById('mobile-suggestions').style.display = 'none'; 
    document.getElementById("mobile-searchbar").blur(); 
    if (window.innerWidth <= 970) closeLeftPane(); 
}

document.getElementById('mobile-searchbar').addEventListener('keydown', function(event) {
    const items = document.querySelectorAll('.suggestion-item');
    let selectedIndex = Array.from(items).findIndex(item => item.classList.contains('selected'));
    if (event.key === "ArrowDown") {
        selectedIndex = (selectedIndex + 1) % items.length;
        items.forEach(item => item.classList.remove('selected'));
        items[selectedIndex].classList.add('selected');
        items[selectedIndex].scrollIntoView({ block: 'nearest' });
        event.preventDefault();
    } else if (event.key === "ArrowUp") {
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        items.forEach(item => item.classList.remove('selected'));
        items[selectedIndex].classList.add('selected');
        items[selectedIndex].scrollIntoView({ block: 'nearest' });
        event.preventDefault();
    } else if (event.key === 'Enter') {
        const selectedItem = document.querySelector('.suggestion-item.selected');
        if (selectedItem) {
            searchWiki(selectedItem.textContent);
            document.getElementById('mobile-suggestions').style.display = 'none';
        }
    }
});

document.getElementById("hamburger").onclick = function() {
    if (isLeftPaneOpen) closeLeftPane();
    else openLeftPane();
};

function openLeftPane() {
    const leftpane = document.getElementById("leftpane");
    leftpane.classList.add("mobile");
    leftpane.style.display = "block";
    document.getElementById("overlay").style.display = "block";
    document.getElementById("second-overlay").style.display = "block"; 
    isLeftPaneOpen = true;
}

function closeLeftPane() {
    const leftpane = document.getElementById("leftpane");
    leftpane.style.display = "none";
    document.getElementById("overlay").style.display = "none";
    document.getElementById("second-overlay").style.display = "none";
    isLeftPaneOpen = false;
}

document.getElementById("overlay").addEventListener('click', closeLeftPane);
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape" && isLeftPaneOpen) closeLeftPane();
});

window.onresize = function() {
    if (window.innerWidth > 970) {
        document.getElementById("leftpane").style.display = "block";
        document.getElementById("leftpane").classList.remove("mobile");
        document.getElementById("overlay").style.display = "none";
        document.getElementById("second-overlay").style.display = "none";
        isLeftPaneOpen = false;
    } else {
        document.getElementById("leftpane").style.display = "none";
        document.getElementById("overlay").style.display = "none";
        document.getElementById("second-overlay").style.display = "none";
        isLeftPaneOpen = false;
    }
};

let touchStartX = 0;
document.getElementById('leftpane').addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});
document.getElementById('leftpane').addEventListener('touchend', function(e) {
    if (e.changedTouches[0].screenX < touchStartX - 50) closeLeftPane();
});

document.querySelectorAll("#leftpane-list button").forEach(button => {
    button.onclick = function() {
        const title = this.getAttribute("data-title");
        if (title === "leftpanesearchbar") {
            return;
        }
        if (title === "Collection") {
            document.getElementById("iframe").src = "https://bindingofisaacrebirth.fandom.com/wiki/Collection_Page_(Repentance)";
        } else if (title) {
            searchWiki(title);
        }
        if (window.innerWidth <= 970) closeLeftPane();
    };
});

document.addEventListener('keydown', function(event) {
    const searchInput = document.getElementById("mobile-searchbar");
    if (document.activeElement !== searchInput) {
        searchInput.focus();
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        const items = document.querySelectorAll('.suggestion-item');
        if (items.length) {
            let selectedIndex = Array.from(items).findIndex(item => item.classList.contains('selected'));
            selectedIndex = (event.key === 'ArrowDown') ? selectedIndex + 1 : selectedIndex - 1;
            selectedIndex = (selectedIndex + items.length) % items.length;
            items.forEach(item => item.classList.remove('selected'));
            items[selectedIndex].classList.add('selected');
            items[selectedIndex].scrollIntoView({ block: 'nearest' });
            event.preventDefault();
        }
    } else if (event.key === 'Enter') {
        const selectedItem = document.querySelector('.suggestion-item.selected');
        if (selectedItem) {
            searchWiki(selectedItem.textContent);
            document.getElementById('mobile-suggestions').style.display = 'none';
        }
    }
});






// Create settings popup
var settingsPopup = document.createElement("div");
settingsPopup.style.position = "fixed";
settingsPopup.style.top = "50%";
settingsPopup.style.left = "62.5%"; 
settingsPopup.style.transform = "translate(-50%, -50%)";
settingsPopup.style.width = "60%"; 
settingsPopup.style.backgroundColor = "#603829";
settingsPopup.style.color = "white"; 
settingsPopup.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
settingsPopup.style.padding = "20px";
settingsPopup.style.display = "none";

settingsPopup.innerHTML = `
    <h2>More features coming soon:</h2>
    <ul style="list-style-type: none; padding: 0; margin: 0; pointer-events: none;">
        <li style="pointer-events: auto;"><input type="checkbox" id="welcome-screen" style="margin-right: 10px; appearance: none; width: 20px; height: 20px;"> Create welcome screen (instructions)</li>
        <li style="pointer-events: auto;"><input type="checkbox" id="collection-progress" disabled style="margin-right: 10px; appearance: none; width: 20px; height: 20px;"><s> Collection</s> progress tracking per user</li>
        <li style="pointer-events: auto;"><input type="checkbox" id="ad-blocking" style="margin-right: 10px; appearance: none; width: 20px; height: 20px;"> Automatic wikia ad blocking</li>
        <li style="pointer-events: auto;"><input type="checkbox" id="ad-blocking" style="margin-right: 10px; appearance: none; width: 20px; height: 20px;"> Code refactor </li>
        <li style="pointer-events: auto;"><input type="checkbox" id="ad-blocking" style="margin-right: 10px; appearance: none; width: 20px; height: 20px;"> search suggestions on mobile</li>
        <li style="pointer-events: auto;"><input type="checkbox" id="ad-blocking" style="margin-right: 10px; appearance: none; width: 20px; height: 20px;"> search suggestions paired with images</li>
        <li style="pointer-events: auto;"><button id="close-settings" style="background-color: #3b3b3b; color: white; border: none; padding: 10px; cursor: pointer;">Close</button></li>
		<p>use these filters with uBlock Origin for Chrome<br>
		bindingofisaacrebirth.fandom.com##.WikiaRail.right-rail-wrapper<br>
		bindingofisaacrebirth.fandom.com##.mcf-wrapper<br>
		bindingofisaacrebirth.fandom.com##.global-footer<br>
		bindingofisaacrebirth.fandom.com###BackToTopBtn<br>
		bindingofisaacrebirth.fandom.com##.notifications-placeholder<br>
		bindingofisaacrebirth.fandom.com###WikiaBar<br>
		bindingofisaacrebirth.fandom.com##.is-visible.fandom-sticky-header<br>
		bindingofisaacrebirth.fandom.com##.global-navigation<br>
		bindingofisaacrebirth.fandom.com##.page__right-rail<br>
		bindingofisaacrebirth.fandom.com##.page-side-tools__wrapper<br>
		bindingofisaacrebirth.fandom.com##.community-header-wrapper<br>
		bindingofisaacrebirth.fandom.com##.tb-box-header<br>
		bindingofisaacrebirth.fandom.com##.page-header__top<br>
		bindingofisaacrebirth.fandom.com##.page-header__actions<br>
		bindingofisaacrebirth.fandom.com##.page-footer</p>
   </ul>
`;

document.body.appendChild(settingsPopup);
document.getElementById("settings-button").onclick = function() {
    settingsPopup.style.display = settingsPopup.style.display === "none" ? "block" : "none";
    if (window.innerWidth <= 970) {
        closeLeftPane(); // Only dismiss the left pane when in mobile view
    }
};

document.getElementById("close-settings").onclick = function() {
    settingsPopup.style.display = "none";
};



document.addEventListener('keydown', function(event) {
    const searchInput = document.getElementById("mobile-searchbar");
    if (document.activeElement !== searchInput) {
        searchInput.focus();
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        const items = document.querySelectorAll('.suggestion-item');
        if (items.length) {
            let selectedIndex = Array.from(items).findIndex(item => item.classList.contains('selected'));
            selectedIndex = (event.key === 'ArrowDown') ? selectedIndex + 1 : selectedIndex - 1;
            selectedIndex = (selectedIndex + items.length) % items.length;
            items.forEach(item => item.classList.remove('selected'));
            items[selectedIndex].classList.add('selected');
            items[selectedIndex].scrollIntoView({ block: 'nearest' });
            event.preventDefault();
        }
    } else if (event.key === 'Enter') {
        const selectedItem = document.querySelector('.suggestion-item.selected');
        if (selectedItem) {
            searchWiki(selectedItem.textContent);
            document.getElementById('mobile-suggestions').style.display = 'none';
        }
    }
});




</script>
