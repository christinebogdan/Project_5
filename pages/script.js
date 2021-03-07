const pathname = window.location.pathname;
const photographerID = pathname.replace(/[^0-9]/g, "");

// change class of main__article
const articleElement = document.querySelector(".main__article");
const filterButton = document.getElementById("filter-button");
const listbox = document.getElementById("listbox");
const optionItems = document.querySelectorAll("#listbox li");
const aside = document.querySelector(".aside");
const modal = document.querySelector(".modal");
const modalOverlay = document.querySelector(".modal__overlay");
const closeModal = document.querySelector(".modal__close");
const form = document.querySelector(".form");
const submitBtn = document.querySelector("form__btn");
const focusableElements = document.querySelectorAll(
  "#close, #firstname, #lastname, #email, #message, #submit"
);

// --------------------------------------------------------- //
// ------------------- PHOTOGRAPHER INFO ------------------- //
// --------------------------------------------------------- //

// get photographer data from json and build photographer
// info element on photographer's page
async function getPhotographerData() {
  try {
    const data = await fetch("../data.json");
    const parsedData = await data.json();
    const photographers = parsedData.photographers;
    console.log(parsedData);
    console.log(photographers);
    createPhotographerInfo(photographers);
    return parsedData;
  } catch (e) {
    console.error(e);
  }
}

// function to build tags in photographer info section
function buildTags(array) {
  const tags = document.createElement("div");
  tags.className = "main__article--tags";

  // add Event Listeners (how can I reduce duplicate code of filter in nav?)

  // tags.addEventListener("click", filterFunction);
  // tags.addEventListener("keydown", (e) => {
  //   if (e.key === "Enter") {
  //     filterFunction(e);
  //   }
  // });

  for (let i = 0; i < array.length; i++) {
    const tag = document.createElement("a");
    tag.textContent = `#${array[i]}`;
    tag.className = "main__article--tag";
    tag.setAttribute("data-name", array[i]);
    tag.setAttribute(
      "aria-label",
      `Link to FishEye homepage showing only photographers that match the filter ${array[i]}`
    );
    tag.href = "../index.html";
    // tag.setAttribute("data-state", "inactive");
    const srOnlySpan = document.createElement("span");
    srOnlySpan.textContent = "Tag";
    srOnlySpan.className = "sr-only";
    tag.appendChild(srOnlySpan);
    tags.appendChild(tag);
  }
  return tags;
}

// create Photographer info element and append to DOM
function createPhotographerInfo(data) {
  const photographer = data[photographerID];

  const textContainer = document.createElement("div");
  const wrapper = document.createElement("div");
  wrapper.classList.add("main__article--wrapper");

  const headline = document.createElement("h1");
  headline.textContent = photographer.name;
  headline.classList.add("main__article--headline");

  const location = document.createElement("p");
  location.textContent = `${photographer.city}, ${photographer.country}`;
  location.classList.add("main__article--location");

  const tagline = document.createElement("p");
  tagline.textContent = photographer.tagline;
  tagline.classList.add("main__article--tagline");

  const tags = buildTags(photographer.tags);

  textContainer.appendChild(headline);
  textContainer.appendChild(location);
  textContainer.appendChild(tagline);
  textContainer.appendChild(tags);

  const button = document.createElement("button");
  button.textContent = "Contact me";
  button.classList.add("main__article--btn");
  button.addEventListener("click", openingModal);

  wrapper.appendChild(textContainer);
  wrapper.appendChild(button);

  const img = document.createElement("img");
  img.src = `../img/photographers/ID_Photos/${photographer.portrait}`;
  img.alt = "";
  img.classList.add("main__article--img");

  articleElement.appendChild(wrapper);
  articleElement.appendChild(img);

  const priceLikeLabel = document.createElement("div");
  priceLikeLabel.classList.add("aside__wrapper");
  const likes = document.createElement("span");
  const price = document.createElement("span");
  price.textContent = `${photographer.price}$ / Day`;

  aside.appendChild(priceLikeLabel);
  priceLikeLabel.appendChild(likes);
  priceLikeLabel.appendChild(price);
}

// --------------------------------------------------------- //
// -------------------- SELECT ELEMENT --------------------- //
// --------------------------------------------------------- //

// -------------------- Focus on Button -------------------- //

// Function to show Listbox
function showListBox() {
  const optionName = filterButton.innerText.toLowerCase();
  const currentOption = document.querySelector(`#${optionName}`);
  // set visual focus on currently selected option
  currentOption.classList.add("is-active");
  // set aria-activedescendant
  listbox.setAttribute("aria-activedescendant", currentOption.id);
  listbox.style.display = "block";
  listbox.focus();
}

// Function to hide Listbox
function hideListBox() {
  listbox.style.display = "none";
  filterButton.setAttribute("aria-expanded", "false");
  listbox.removeAttribute("aria-activedescendant");
  // wieso bricht das den e.key === Enter Mechanismus?
  // filterButton.focus();
}

// Click Event on Button
filterButton.addEventListener("click", () => {
  if (document.activeElement === filterButton) {
    showListBox();
  } else if (document.activeElement === listbox) {
    // add option of clicking on body to close listbox
    // add choice of new option before hiding listbox
    // warum funktioniert das hier, wenn ich den eventListener
    // auf button setze, und nicht auf listbox
    hideListBox();
  }
});

// Keydown Event on Button
// wieso funktioniert es hier nicht, wenn ich eventListener auf
// button setze?
filterButton.addEventListener("keydown", (e) => {
  // if focus is on button
  if (document.activeElement === filterButton) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
      showListBox();
    }
  }
});

// -------------------- Focus on Listbox -------------------- //

// Click Event on Listbox
// ERROR wenn ich an die Ecke des Buttons clicke, wählt er alle drei aus
listbox.addEventListener("click", (e) => {
  // liegt an event target listbox (s. nächste Zeile)
  console.log(e.target);
  e.stopPropagation();
  const currentOption = document.querySelector(".is-active");
  const selectedOption = e.target;
  currentOption.classList.remove("is-active");
  selectedOption.classList.add("is-active");
  listbox.setAttribute("aria-activedescendant", selectedOption.id);
  let buttonText = document.querySelector(".is-active").innerText;
  filterButton.textContent = buttonText;
  hideListBox();
});

// Keydown Event on Listbox
listbox.addEventListener("keydown", (e) => {
  const currentOption = document.querySelector(".is-active");
  let selectedOption;
  let buttonText;
  if (document.activeElement === listbox) {
    if (e.key === "Home") {
      selectedOption = listbox.firstElementChild;
    }
    if (e.key === "End") {
      selectedOption = listbox.lastElementChild;
      // wieso kann ich diesen Block nicht einfach ans Ende packen und nur einmal
      // durchlaufen lassen. Bekomme Error "cannot read property classList of null
      // at HTMLULListElement"
      currentOption.classList.remove("is-active");
      selectedOption.classList.add("is-active");
      listbox.setAttribute("aria-activedescendant", selectedOption.id);
    }
    if (e.key === "ArrowDown") {
      selectedOption = currentOption.nextElementSibling;
      if (selectedOption === null) {
        selectedOption = listbox.firstElementChild;
      }
      currentOption.classList.remove("is-active");
      selectedOption.classList.add("is-active");
      listbox.setAttribute("aria-activedescendant", selectedOption.id);
    }
    if (e.key === "ArrowUp") {
      selectedOption = currentOption.previousElementSibling;
      if (selectedOption === null) {
        selectedOption = listbox.lastElementChild;
      }
      currentOption.classList.remove("is-active");
      selectedOption.classList.add("is-active");
      listbox.setAttribute("aria-activedescendant", selectedOption.id);
    }
    if (e.key === "Enter") {
      let buttonText = document.querySelector(".is-active").innerText;
      filterButton.textContent = buttonText;
      // warum funktioniert hier console.log(selectedOption nicht - und ich
      // kriege undefined)
      // console.log(selectedOption);
      hideListBox();
    }
    if (e.key === "Escape") {
      hideListBox();
    }
  }
});

// --------------------------------------------------------- //
// ------------------------- MODAL ------------------------- //
// --------------------------------------------------------- //

// ----------------------- Open Modal ---------------------- //

function openingModal() {
  modal.style.display = "block";
  document.getElementById("firstname").focus();
}

// Event Listener Added inside Content Building function

// ---------------------- Close Modal ---------------------- //

modal.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closingModal();
  }
});

function closingModal() {
  modal.style.display = "none";
  document.querySelector(".main__article--btn").focus();
}

closeModal.addEventListener("click", closingModal);

closeModal.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    closingModal();
  }
});

// -------------- Manage Focus Inside Modal --------------- //

modal.addEventListener("keydown", (e) => {
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  // die Shift Key Tab Kombi funktioniert nicht
  // von Close X zu Button zurück funktioniert. Aber nicht von
  // first Name zu Close X
  // funktioniert nur mit Extra IF (s.u.)
  if (e.key === "Tab") {
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
        console.log("test");
      }
      if (document.activeElement === focusableElements[1]) {
        e.preventDefault();
        firstElement.focus();
        console.log("test");
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }
});

// --------------------------------------------------------- //
// -------------------------- FORM ------------------------- //
// --------------------------------------------------------- //

// print out the content of input fields to console

form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(
    `First name: ${firstname.value}, Last name: ${lastname.value}, Email: ${email.value}, Message: ${message.value}`
  );
  closingModal();
});

// build page content
getPhotographerData();

// BODY
// when clicking outside of listbox, close listbox

// SET focus on filterButton, after choice is made and listbox closed

// aria - activedescendant = "ID_REF";
// Set by the JavaScript when it displays and sets focus on the listbox; otherwise is not present.
// Refers to the option in the listbox that is visually indicated as having keyboard focus.
// When navigation keys, such as Down Arrow, are pressed, the JavaScript changes the value.
// Enables assistive technologies to know which element the application regards as focused while DOM focus remains on the ul element.
// For more information about this focus management technique, see Using aria-activedescendant to Manage Focus.

// DONE //
// DONE //
// DONE //

// ESCAPE
//	If the listbox is displayed, collapses the listbox and moves focus to the button.

// UP ARROW
// Moves focus to and selects the previous option.
// If the listbox is collapsed, also expands the list.

// DOWN ARROW
// Moves focus to and selects the next option.
// If the listbox is collapsed, also expands the list.

// ENTER
// If the focus is on the button, expands the listbox and places focus on the currently selected option in the list.
// If focus is in the listbox , collapses the listbox and keeps the currently selected option as the button label.

// HOME
// If the listbox is displayed, moves focus to and selects the first option.

// END
// If the listbox is displayed, moves focus to and selects the last option.
