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
// const previousBtn = pageBtnContainer.querySelector("#prev-Btn");
// const nextBtn = pageBtnContainer.querySelector("#next-Btn");
const mainDisplayContainer = document.querySelector("#main-display-container");
const inputcontainer = document.querySelector(".search-input-container");
const searchInput = document.querySelector(".search-input");
const mainContainer = document.querySelector(".main-container");
const darkModeBtn = document.querySelector(".dark-mode-toggle");
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
    // let { results } = data;
    // console.log(re)
    data.forEach((character) => {
      charactersString += `
      <div class="character-tile dark-mode-elements">
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
        <p class="character-name-info">
          ${character.name}
        </p>
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
        mainDisplayContainer.classList.add("add-height");
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
      mainDisplayContainer.classList.remove("add-height");
      targetDom.classList.remove("hide-item");
      replacementDom.classList.add("hide-item");
      backBtnContainer.classList.remove("show-item");
      backBtnContainer.classList.remove("show-item");
    });
  };
  static searchCharacters = (data) => {
    let { count, next, previous, results: characters } = data;

    searchInput.addEventListener("keyup", (ursula) => {
      let searchString = ursula.target.value.toLowerCase();
      let filteredCharacters = characters.filter((character) => {
        return character.name.toLowerCase().includes(searchString);
      });
      this.displayCharacters(filteredCharacters, charactersDOM);
    });
  };
  static toggleDarkMode = () => {
    const characterTiles = [...document.querySelectorAll(".character-tile")];
    console.log(characterTiles);
    const darkModeElems = document.querySelectorAll(".dark-mode-elements");
    const lightModeElems = document.querySelectorAll(".light-mode-elements");
    // darkModeElems.forEach( elem => {
    //   elem.classList.toggle("character-tile-shadow-")
    // })
    darkModeBtn.addEventListener("click", () => {
      mainContainer.classList.toggle("light-mode");
      darkModeElems.forEach((elem) => {
        elem.classList.toggle("light-mode");
      });
      lightModeElems.forEach((elem) => {
        elem.classList.toggle("darken-light-text");
      });
      inputcontainer.classList.add("dark-light-input");
    });
  };
  // ======

  // static paginateCharacters = (charactersData, charactersDOM) => {
  //   let {
  //     count,
  //     next: nextUrl,
  //     previous: previousUrl,
  //     results,
  //   } = charactersData;
  //   nextBtn.addEventListener("click", () => {
  //     mainUrl = nextUrl;
  //   });
  // };
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
  static retriveCharacters = (namematch) => {
    let characters = JSON.parse(localStorage.getItem("starWarsCharacters"));
    characters = characters.filter((character) =>
      character.includes(namematch)
    );
    return characters;
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

// setup app
document.addEventListener("DOMContentLoaded", () => {
  Data.getCharacters(urlHolder.url)
    .then((charactersData) => {
      spinner.classList.add("hide-item");
      let { results } = charactersData;
      UI.displayCharacters(results, charactersDOM);
      Storage.saveCharacters(charactersData);
      UI.searchCharacters(charactersData);
    })
    .then(() => {
      UI.populateSingleCharacter();
      // UI.toggleDarkMode();
    });
});
