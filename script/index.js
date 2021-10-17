// function main(){

// }

// module.exports = {main}

//
const charactersDOM = document.querySelector(".all-characters-tile-display");
const singleCharacterDOM = document.querySelector(
  ".single-character-details-display"
);

const url = `https://swapi.dev/api/people`;

// fetch data
const getCharacters = async (url) => {
  // we put the logic throught the try catch block
  // in order to handle errors
  try {
    //  using fetch and an IIFE we get the data
    const data = await (await fetch(url)).json();
    // const imageData = await (await fetch(imageUrl)).json();
    // console.log(imageData);
    let { count, next, previous, results } = data;
    // using map we extract just what we need {name height and gender}
    results = results.map((character) => {
      let { name, height, gender, url } = character;
      return { name, height, gender, url };
    });
    return { count, next, previous, results };
  } catch (error) {
    console.log(error);
  }
};
// STORAGE things
// save data
const saveCharacters = ({ results }) => {
  localStorage.setItem("starWarsCharacters", JSON.stringify(results));
};
// getCharacters
const retriveCharacter = (nameTag) => {
  let characters = JSON.parse(localStorage.getItem("starWarsCharacters"));
  return characters.find((character) => character.name.includes(nameTag));
};

// UI things
// display all characters
const displayCharacters = (data, display) => {
  let charactersString = "";
  let { results } = data;
  results.forEach((character) => {
    charactersString += `
    <div class="character-tile">
          <div class="character-img-container">
            <img src="./assets/characters/${parseInt(
              getIdFromUrl(character.url)
            )}.jpg" alt=${character.name} class="character-img">
          </div>
          <div class="mini character-name-container">
              <h3 class="character-name" data-name=${character.name}>
                  ${character.name}
              </h3>
          </div>
      </div>
    `;
  });
  display.innerHTML = charactersString;
};
// get the id for the particular star wars character from the url
var getIdFromUrl = function (value) {
  var id = value.match(/([0-9])+/g);
  id = id[0];
  return id;
};
const getCharacterNames = () => {
  let names = [...document.querySelectorAll(".character-name")];
  names.forEach((name) => {
    let nameTag = name.dataset.name;
    name.addEventListener("click", (e) => {
      // get characters from storage
      let character = retriveCharacter(nameTag);
      displaySingleCharacter(character, singleCharacterDOM);
    });
  });
};
// display single data
const displaySingleCharacter = (character, display) => {
  let characterString = `<div class="character-img-container-info">
    <img src="./assets/characters/${parseInt(
      getIdFromUrl(character.url)
    )}.jpg" alt=${character.name} class="character-img">
  </div>
  <div class="full-info-container">
    <div class="full character-name-container">
      <h2 class="character-name-info">
        ${character.name}
      </h2>
    </div>
    <ul class="mini-info">
      <li class="info">Gender: ${character.gender}</li>
      <li class="info">Height: ${character.height}</li>
    </ul>
  </div>`;
  display.innerHTML = characterString;
};
// PAGINATION things
// paginate data

// setup app
document.addEventListener("DOMContentLoaded", () => {
  getCharacters(url)
    .then((characters) => {
      displayCharacters(characters, charactersDOM);
      saveCharacters(characters);
    })
    .then(() => {
      getCharacterNames();
    });
});
