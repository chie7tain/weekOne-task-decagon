// function main(){

// }

// module.exports = {main}

//
// DOM Elements
const charactersDOM = document.querySelector(".all-characters-tile-display");
const singleCharacterDOM = document.querySelector(
  ".single-character-details-display"
);
const backBtnContainer = document.querySelector(".back-button-container");
const backBtn = document.querySelector(".back-btn");
const spinner = document.querySelector(".spinner-wrapper");
const pageBtnContainer = document.querySelector(".page-btn-container");
const previousBtn = pageBtnContainer.querySelector("#prev-Btn");
const nextBtn = pageBtnContainer.querySelector("#next-Btn");

// end of DOM Elements

let urlHolder = {
  url: `https://swapi.dev/api/people`,
};
// DATA class
// UI Class
class Data {
  // fetch data
  static getCharacters = async (url) => {
    // we put the logic throught the try catch block
    // in order to handle errors
    try {
      //  using fetch and an IIFE we get the data
      const data = await (await fetch(url)).json();

      // const imageData = await (await fetch(imageUrl)).json();
      // console.log(imageData);
      let { count, next, previous, results } = data;
      console.log(data);
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
}
// UI Class
class UI {
  // display all characters
  static displayCharacters = (data, display) => {
    let charactersString = "";
    let { results } = data;
    results.forEach((character) => {
      charactersString += `
      <div class="character-tile">
            <div class="character-img-container">
              <img src="./assets/characters/${parseInt(
                Helper.getIdFromUrl(character.url)
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
  // display single character
  static displaySingleCharacter = (character, display) => {
    let characterString = `<div class="character-img-container-info">
      <img src="./assets/characters/${parseInt(
        Helper.getIdFromUrl(character.url)
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
  // =====
  static populateSingleCharacter = () => {
    let names = [...document.querySelectorAll(".character-name")];
    let character = "";
    names.forEach((name) => {
      let nameTag = name.dataset.name;
      name.addEventListener("click", (e) => {
        // get characters from storage
        backBtnContainer.classList.add("show-item");
        pageBtnContainer.classList.add("hide-item");
        character = Storage.retriveCharacter(nameTag);
        UI.displaySingleCharacter(character, singleCharacterDOM);
        UI.updateCharacterDom(charactersDOM, singleCharacterDOM);
      });
    });
  };
  // =====
  static updateCharacterDom = (targetDom, replacementDom) => {
    targetDom.classList.add("hide-item");
    replacementDom.classList.remove("hide-item");

    backBtn.addEventListener("click", () => {
      pageBtnContainer.classList.remove("hide-item");
      targetDom.classList.remove("hide-item");
      replacementDom.classList.add("hide-item");
      backBtnContainer.classList.remove("show-item");
      backBtnContainer.classList.remove("show-item");
    });
  };
  // ======
  static paginateCharacters = (charactersData, charactersDOM) => {
    let {
      count,
      next: nextUrl,
      previous: previousUrl,
      results,
    } = charactersData;
    console.log(nextUrl);
    nextBtn.addEventListener("click", () => {
      mainUrl = nextUrl;
    });
  };
}

// STORAGE things
class Storage {
  // save data
  static saveCharacters = ({ results }) => {
    localStorage.setItem("starWarsCharacters", JSON.stringify(results));
  };
  // getCharacters
  static retriveCharacter = (nameTag) => {
    let characters = JSON.parse(localStorage.getItem("starWarsCharacters"));
    return characters.find((character) => character.name.includes(nameTag));
  };
}

class Helper {
  // get the id for the particular star wars character from the url
  static getIdFromUrl = (value) => {
    let id = value.match(/([0-9])+/g);
    id = id[0];
    return id;
  };
}

// PAGINATION things
// paginate data
console.log(urlHolder.url);
// setup app
document.addEventListener("DOMContentLoaded", () => {
  Data.getCharacters(urlHolder.url)
    .then((charactersData) => {
      spinner.classList.add("hide-item");
      UI.displayCharacters(charactersData, charactersDOM);
      UI.paginateCharacters(charactersData, charactersDOM);
      Storage.saveCharacters(charactersData);
    })
    .then(() => {
      UI.populateSingleCharacter();
    });
});
