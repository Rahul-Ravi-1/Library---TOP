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
let selectedCharacterId = null;

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
    // Intentionally left blank for custom Add/Remove wiring.
}

function displayCharacters() {
    const container = document.querySelector(".character-container");
    container.innerHTML = "";

    party.forEach((player) => {
        const card = createCharacterCard(player);
        container.appendChild(card);
    });
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

    if (player.id === selectedCharacterId) {
        card.classList.add("is-selected");
    }

    card.addEventListener("click", () => {
        if (selectedCharacterId === player.id) {
            selectedCharacterId = null;
        } else {
            selectedCharacterId = player.id;
        }
        displayCharacters();
    });

    card.append(name, classType, level, hp, status);
    return card;
}

setupActionButtons();
displayCharacters();