const defaultData = [
    { name: "Rahul", classType: "Warrior", level: 69, hp: 83, isActive: true },
    { name: "Ayla", classType: "Mage", level: 42, hp: 61, isActive: true },
    { name: "Borin", classType: "Paladin", level: 55, hp: 94, isActive: false },
    { name: "Kira", classType: "Rogue", level: 37, hp: 73, isActive: true },
];

const party = defaultData.map(
    (character) =>
        new PlayerCharacter(
            character.name,
            character.classType,
            character.level,
            character.hp,
            character.isActive
        )
);
let selectedCharacterId = new Set();
let canRemove = false;

function PlayerCharacter(name, classType, level, hp, isActive) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.classType = classType;
    this.level = level;
    this.hp = hp;
    this.isActive = isActive;
}

function createCharacter(name, classType, level, hp, isActive) {
    return new PlayerCharacter(name, classType, level, hp, isActive);
}

function setupActionButtons() {
    const addBtn = document.querySelector("#add-character-btn");
    const removeBtn = document.querySelector("#remove-character-btn");
    const confirmRemoveBtn = document.querySelector("#confirm-remove-btn");

    const dialog = document.querySelector("#addCharacter");
    const form = document.querySelector("#add-character-form");

    const addFormBtn = document.querySelector("#add-character-form");
    const cancelFormBtn = document.querySelector("#cancel-add-player");

    if (!addBtn || !removeBtn || !dialog || !addFormBtn || !cancelFormBtn) {
        return;
    }
    
    if (removeBtn) {
        removeBtn.setAttribute("aria-pressed", "false");
    }

    updateRemoveUI();

    removeBtn.addEventListener("click", () => {
        canRemove = !canRemove;
        if (!canRemove) {
            selectedCharacterId.clear();
        }
        updateRemoveUI();
        displayCharacters();
    });

    if (confirmRemoveBtn) {
        confirmRemoveBtn.addEventListener("click", () => {
           const selectedIds = selectedCharacterId;
           const kept = party.filter(player => !selectedIds.has(player.id))
           party.splice(0, party.length, ...kept);
           selectedCharacterId.clear();
            canRemove = false;
           displayCharacters();
        });
    }

    addBtn.addEventListener("click", () => {
        dialog.showModal();
    });

    cancelFormBtn.addEventListener("click", () => {
        dialog.close();
    });

    dialog.addEventListener("click", (event) => {
        const rect = dialog.getBoundingClientRect();
        const clickedInsideDialog =
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom;

        if (!clickedInsideDialog) {
            dialog.close();
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const fd = new FormData(form);
        const player = new PlayerCharacter(
            String(fd.get("name")).trim(),
            String(fd.get("classType")).trim(),
            Number(fd.get("level")),
            Number(fd.get("hp")),
            fd.get("isActive") === "on"
          );
          party.push(player)
          if (!canRemove) {
              selectedCharacterId.clear();
          }
          displayCharacters();
          form.reset();
          dialog.close();
    });
}

function displayCharacters() {
    const container = document.querySelector(".character-container");
    container.innerHTML = "";

    party.forEach((player) => {
        const card = createCharacterCard(player);
        container.appendChild(card);
    });

    updateRemoveUI();
}

function createCharacterCard(player) {
    const card = document.createElement("button");
    const name = document.createElement("h2");
    const classType = document.createElement("p");
    const level = document.createElement("p");
    const hp = document.createElement("p");
    const status = document.createElement("p");

    card.type = "button";
    card.className = "character-card";
    name.textContent = player.name;
    classType.textContent = `Class: ${player.classType}`;
    level.textContent = `Level: ${player.level}`;
    hp.textContent = `Health: ${player.hp}`;
    status.textContent = `Status: ${player.isActive ? "Active" : "Resting"}`;
    status.className = player.isActive ? "status-active" : "status-resting";

    if (canRemove && selectedCharacterId.has(player.id)) {
        if(!card.classList.contains("is-selected") || !card.classList.contains("is-remove-selected"))
        {
            card.classList.add("is-selected");
            card.classList.add("is-remove-selected");
        }
    }

    card.addEventListener("click", () => {
        if (!canRemove) {
            return;
        }

        if (selectedCharacterId.has(player.id)) {
            selectedCharacterId.delete(player.id);
        } else {
            selectedCharacterId.add(player.id);
        }
        displayCharacters();
    });

    card.append(name, classType, level, hp, status);
    return card;
}

function updateRemoveUI() {
    const removeBtn = document.querySelector("#remove-character-btn");
    const removeBar = document.querySelector(".remove-action-bar");
    const confirmRemoveBtn = document.querySelector("#confirm-remove-btn");

    if (removeBtn) {
        removeBtn.classList.toggle("is-active", canRemove);
        removeBtn.setAttribute("aria-pressed", String(canRemove));
    }

    if (removeBar) {
        removeBar.classList.toggle("is-visible", canRemove);
    }

    if (confirmRemoveBtn) {
        confirmRemoveBtn.disabled = selectedCharacterId.size === 0;
    }
}


setupActionButtons();
displayCharacters();