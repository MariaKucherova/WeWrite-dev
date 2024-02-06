async function getCards() {
    const response = await fetch("/notes", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });

    if (response.ok == true) {
        const notes = await response.json();
        const cards = document.getElementsByClassName("cards");

        const number = notes.length > 3 ? 3 : notes.length;

        for (let i = 0; i < cards.length; i++) {
            for (let j = 0; j < number; j++) {
                cards[i].appendChild(addCard(notes[j]));
            }
        }
    }   
}

async function getCard(id) {
    let = document.getElementById("popup-overlay");
    showPopup(popupOverlay);

    const response = await fetch(`/notes/${id}`, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });

    if (response.ok === true) {
        const note = await response.json();
        document.getElementById("noteId").value = note.id;
        document.getElementById("noteTitle").value = note.title;
        document.getElementById("noteText").value = note.text;
    } else {
        const error = await response.json();
        console.log(error.message);
    }
}

async function editUser() {
    const response = await fetch("/notes", {
        method: "PUT",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            id: document.getElementById("noteId").value,
            title: document.getElementById("noteTitle").value,
            text: document.getElementById("noteText").value
        })
    });

    if (response.ok === true) {
        const note = await response.json();

        const cards = document.getElementsByClassName("card");
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].childNodes[0].innerText == note.id) {
                cards[i].childNodes[1].innerText = note.title;
                cards[i].childNodes[2].innerText = note.text;
            }
        }
    } else {
        const error = await response.json();
        console.log(error.message);
    }

    hidePopup(document.getElementById("popup-overlay"));
}

async function deleteNote(id) {
    const response = await fetch(`/notes/${id}`, {
        method: "DELETE",
        headers: { "Accept": "application/json" }
    });

    if (response.ok === true) {
        const note = await response.json();

        const cards = document.getElementsByClassName("card");
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].childNodes[0].innerText == note.id) {
                cards[i].remove();
            }
        }
    } else {
        const error = await response.json();
        console.log(error.message);
    }
}

function showPopup(popupOverlay) {
    popupOverlay.style.display = "block";  
}

function hidePopup(popupOverlay) {
    popupOverlay.style.display = "none";
}

function addCard(card) {
    
    const divCard = document.createElement("div");
    divCard.setAttribute("class", "card");

    const divCardId = document.createElement("input");
    divCardId.setAttribute("id", "card__id");
    divCardId.setAttribute("type", "hidden");
    divCardId.textContent = card.id;
    divCard.appendChild(divCardId);

    const divCardTitle = document.createElement("div");
    divCardTitle.setAttribute("class", "card__title");
    divCardTitle.textContent = card.title;
    divCard.appendChild(divCardTitle);

    const divCardText = document.createElement("div");
    divCardText.setAttribute("class", "card__text");
    divCardText.textContent = card.text;
    divCard.appendChild(divCardText);

    const divBtn = document.createElement("div");
    divBtn.setAttribute("class", "divBtn");

    const editBtn = document.createElement("button");
    editBtn.setAttribute("class", "btn");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", async () => getCard(card.id));
    divBtn.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.setAttribute("class", "btn");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", async () => deleteNote(card.id));
    divBtn.appendChild(deleteBtn);

    divCard.appendChild(divBtn);

    return divCard;
}