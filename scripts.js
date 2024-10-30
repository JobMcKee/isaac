
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


// Ensure that clicking the search button focuses on the input field
document.querySelector('[data-title="leftpanesearchbar"]').onclick = function() {
    document.getElementById("mobile-searchbar").focus(); // Focus the input field
};
