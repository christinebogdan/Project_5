const pathname = window.location.pathname;
const photographerID = parseInt(pathname.replace(/[^0-9]/g, ""));

// change class of main__article
const articleElement = document.querySelector(".main__article");
const filterButton = document.getElementById("filter-button");
const listbox = document.getElementById("listbox");
const buttonArrow = document.getElementById("filter-button-arrow");
const optionItems = document.querySelectorAll("#listbox li");
const gallery = document.querySelector(".gallery");
const aside = document.querySelector(".aside");
const modal = document.querySelector(".modal");
const modalOverlay = document.querySelector(".modal__overlay");
// all focusable elements inside modal
const focusableElements = document.querySelectorAll(
  "#close, #firstname, #lastname, #email, #message, #submit"
);
const firstElement = focusableElements[0];
const lastElement = focusableElements[focusableElements.length - 1];
const closeModal = document.querySelector(".modal__close");
const form = document.querySelector(".form");
const submitBtn = document.querySelector("form__btn");
const photographerMedia = [];
let totalLikeCount = 0;

// build page content
buildPageContent();

// --------------------------------------------------------- //
// ------------------- PHOTOGRAPHER INFO ------------------- //
// --------------------------------------------------------- //

async function getData() {
  try {
    const data = await fetch("../../data.json");
    const parsedData = await data.json();
    console.log(parsedData);
    return parsedData;
  } catch (e) {
    console.error(e);
  }
}

function getPhotographerMedia(media) {
  for (let i = 0; i < media.length; i++) {
    let mediaItem = media[i];
    if (mediaItem.photographerId === photographerID) {
      photographerMedia.push(mediaItem);
      totalLikeCount += mediaItem.likes;
    }
  }
}

async function buildPageContent() {
  const data = await getData();
  let media = data.media;
  const photographers = data.photographers;
  getPhotographerMedia(media);
  createPhotographerInfo(photographers);
  createGallery(photographerMedia);
  sortGallery("popularity");
}

// function to build tags in photographer info section
function buildTags(array) {
  const tags = document.createElement("div");
  tags.className = "main__article--tags";

  for (let i = 0; i < array.length; i++) {
    const tag = document.createElement("a");
    tag.textContent = `#${array[i]}`;
    tag.className = "main__article--tag";
    tag.setAttribute("data-name", array[i]);
    tag.setAttribute(
      "aria-label",
      `Link to FishEye homepage showing only photographers that match the filter ${array[i]}`
    );
    tag.href = `../index.html?${array[i]}`;
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
  let photographer;

  for (let i = 0; i < data.length; i++) {
    if (Object.values(data[i]).some((el) => el === photographerID)) {
      photographer = data[i];
    }
  }

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

  // aside
  const priceLikeLabel = document.createElement("div");
  priceLikeLabel.classList.add("aside__wrapper");
  const likes = document.createElement("span");
  likes.id = "aside__count";
  likes.textContent = totalLikeCount;
  const heart = document.createElement("img");
  heart.src = "../img/heart-black.svg";
  heart.classList.add("aside__heart");
  const price = document.createElement("span");
  price.classList.add("aside__price");
  price.textContent = `${photographer.price}$ / Day`;

  aside.appendChild(priceLikeLabel);
  priceLikeLabel.appendChild(likes);
  priceLikeLabel.appendChild(heart);
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
  buttonArrow.style.WebkitTransform = "rotate(180deg)";
}

// Function to hide Listbox
function hideListBox() {
  listbox.style.display = "none";
  filterButton.setAttribute("aria-expanded", "false");
  listbox.removeAttribute("aria-activedescendant");
  buttonArrow.style.WebkitTransform = "rotate(0deg)";
  filterButton.focus();

  // wieso bricht das den e.key === Enter Mechanismus?
  // filterButton.focus();
}

// Click Event on Button
filterButton.addEventListener("click", (e) => {
  if (document.activeElement === filterButton) {
    filterButton.setAttribute("aria-expanded", "true");
    showListBox();
  }

  // else if (document.activeElement === listbox) {
  //   buttonArrow.style.WebkitTransform = "rotate(0deg)";

  //   // add option of clicking on body to close listbox
  //   // add choice of new option before hiding listbox
  //   // warum funktioniert das hier, wenn ich den eventListener
  //   // auf button setze, und nicht auf listbox
  //   hideListBox();
  // }
});

document.getElementById("filter-button-arrow").addEventListener("click", () => {
  filterButton.focus();
  if (document.activeElement === filterButton) {
    filterButton.setAttribute("aria-expanded", "true");
    showListBox();
    // prints test to console even when closing listbox with arrow
    console.log("test");
  }
});

// Keydown Event on Button
filterButton.addEventListener("keydown", (e) => {
  // if focus is on button
  if (document.activeElement === filterButton) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
      e.preventDefault();
      showListBox();
    }
  }
});

// -------------------- Focus on Listbox -------------------- //

// Click Event on Listbox
listbox.addEventListener("click", (e) => {
  e.stopPropagation();
  const currentOption = document.querySelector(".is-active");
  const selectedOption = e.target;
  currentOption.classList.remove("is-active");
  selectedOption.classList.add("is-active");
  listbox.setAttribute("aria-activedescendant", selectedOption.id);
  let buttonText = document.querySelector(".is-active").innerText;
  filterButton.textContent = buttonText;
  hideListBox();
  sortGallery(buttonText.toLowerCase());
});

document
  .getElementById("filter-button-arrow")
  .addEventListener("click", (e) => {
    if (document.activeElement === listbox) {
      hideListBox();
    }
  });

// Keydown Event on Listbox
listbox.addEventListener("keydown", (e) => {
  e.preventDefault();
  const currentOption = document.querySelector(".is-active");
  let selectedOption;
  let buttonText;
  if (document.activeElement === listbox) {
    switch (e.key) {
      case "Home":
        selectedOption = listbox.firstElementChild;
        break;
      case "End":
        selectedOption = listbox.lastElementChild;
        break;
      case "ArrowDown":
        selectedOption = currentOption.nextElementSibling;
        if (selectedOption === null) {
          selectedOption = listbox.firstElementChild;
        }
        break;
      case "ArrowUp":
        selectedOption = currentOption.previousElementSibling;
        if (selectedOption === null) {
          selectedOption = listbox.lastElementChild;
        }
        break;
      // warum button focus style, wenn Enter, aber nicht, wenn click
      case "Enter":
        selectedOption = document.querySelector(".is-active").innerText;
        filterButton.textContent = selectedOption;
        hideListBox();
        sortGallery(selectedOption.toLowerCase());
        break;
      case "Escape":
        selectedOption = document.querySelector(".is-active");
        hideListBox();
        break;
    }
    currentOption.classList.remove("is-active");
    selectedOption.classList.add("is-active");
    listbox.setAttribute("aria-activedescendant", selectedOption.id);
  }
});

// sort gallery by popularity, date, title
function sortGallery(sortBy) {
  const gallery = document.querySelector(".gallery");
  const nodes = Array.from(gallery.children);
  // nodes = [...nodes];
  switch (sortBy) {
    case "popularity":
      nodes.sort(sortByPopularity);
      break;
    case "date":
      nodes.sort(sortByDate);
      break;
    case "title":
      nodes.sort(sortByTitle);
      break;
  }
  nodes.forEach((node) => {
    gallery.appendChild(node);
  });
  countLikes();
}

// sorting function by popularity
function sortByPopularity(a, b) {
  const valueA = parseInt(a.getAttribute("data-likes"));
  const valueB = parseInt(b.getAttribute("data-likes"));
  return valueB - valueA;
}

// sorting function by title
function sortByTitle(a, b) {
  const valueA = a.getAttribute("data-title");
  const valueB = b.getAttribute("data-title");
  if (valueA < valueB) {
    return -1;
  } else if (valueA === valueB) {
    return 0;
  } else {
    return 1;
  }
}

// sorting function by date
function sortByDate(a, b) {
  const valueA = new Date(a.getAttribute("data-date"));
  const valueB = new Date(b.getAttribute("data-date"));
  return valueB - valueA;
}

// --------------------------------------------------------- //
// ------------------------- MODAL ------------------------- //
// --------------------------------------------------------- //

// ----------------------- Open Modal ---------------------- //

function openingModal() {
  modalOverlay.style.display = "flex";
  firstElement.focus();
}

// Event Listener Added inside Content Building function

// ---------------------- Close Modal ---------------------- //

function closingModal() {
  modalOverlay.style.display = "none";
  document.querySelector(".main__article--btn").focus();
}

modal.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closingModal();
  }
});

modalOverlay.addEventListener("click", closingModal);

closeModal.addEventListener("click", closingModal);

closeModal.addEventListener("keydown", (e) => {
  if (e.target === closeModal) {
    if (e.key === " ") {
      closingModal();
      // enter funktioniert nicht
    } else if (e.key === "Enter") {
      console.log(124);
      closingModal();
    }
  }
});

// -------------- Manage Focus Inside Modal --------------- //

modal.addEventListener("keydown", (e) => {
  // die Shift Key Tab Kombi funktioniert nicht
  // von Close X zu Button zurück funktioniert. Aber nicht von
  // first Name zu Close X
  // funktioniert nur mit Extra IF (s.u.)
  if (e.key === "Tab") {
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (document.activeElement === focusableElements[1]) {
        e.preventDefault();
        firstElement.focus();
      }
    } else if (document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
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

// --------------------------------------------------------- //
// ------------------------- GALLERY------------------------ //
// --------------------------------------------------------- //

// could sort media into video and image array beforehand?

// Factory Method: "Define an interface for creating an object,
// but let the classes which implement the interface decide which class
// to instantiate. The Factory method lets a class defer
// instantiation to subclasses" (c) GoF.

// can this be a class or does it have to be a
// constructor function?

class Video {
  constructor(element) {
    this.element = element;
  }

  #getTitle(string) {
    // "Sport_Sky_Cross.jpg";
    let title = string.substring(string.indexOf("_") + 1);
    title = title.replace(/_/g, " ");
    title = title.replace(/.mp4/g, "");
    return title;
  }

  #getSource(string) {
    let source = this.element.video;
    source = source.replace(/.mp4/g, "");
    return source;
  }

  render() {
    // create container for gallery element
    const galleryElement = document.createElement("div");
    galleryElement.classList.add("gallery__element");
    galleryElement.setAttribute("data-date", this.element.date);
    galleryElement.setAttribute("data-likes", this.element.likes);
    galleryElement.setAttribute(
      "data-title",
      this.#getTitle(this.element.video)
    );

    // create video
    const videoTag = document.createElement("video");
    videoTag.classList.add("gallery__mediaItem");
    const sourceTag = document.createElement("source");
    sourceTag.src = `../img/photographers/${photographerID}/${this.#getSource(
      this.element.video
    )}.mp4`;
    videoTag.appendChild(sourceTag);

    // create container for title, price, likes
    const mediaInfo = document.createElement("div");
    mediaInfo.classList.add("gallery__mediaInfo");

    // create title, price, likes
    const title = document.createElement("p");
    title.textContent = this.#getTitle(this.element.video);
    title.classList.add("gallery__mediaInfo--title");
    const likes = document.createElement("p");
    likes.textContent = this.element.likes;
    likes.classList.add("gallery__mediaInfo--likes");
    const heart = document.createElement("img");
    heart.src = "../img/heart-red.svg";
    heart.alt = "likes";
    heart.classList.add("gallery__mediaInfo--likesImg");
    const price = document.createElement("p");
    price.textContent = `${this.element.price} $`;
    price.classList.add("gallery__mediaInfo--price");

    // append all
    mediaInfo.appendChild(title);
    mediaInfo.appendChild(price);
    mediaInfo.appendChild(likes);
    mediaInfo.appendChild(heart);
    galleryElement.appendChild(videoTag);
    galleryElement.appendChild(mediaInfo);

    return galleryElement;
  }
}

class Image {
  constructor(element) {
    this.element = element;
  }

  #getTitle(string) {
    // "Sport_Sky_Cross.jpg";
    let title = string.substring(string.indexOf("_") + 1);
    title = title.replace(/_/g, " ");
    title = title.replace(/.jpg/g, "");
    return title;
  }

  #getSource(string) {
    let source = this.element.image;
    source = source.replace(/.jpg/g, "");
    return source;
  }

  render() {
    // create container for gallery element
    const galleryElement = document.createElement("div");
    galleryElement.classList.add("gallery__element");
    galleryElement.setAttribute("data-date", this.element.date);
    galleryElement.setAttribute("data-likes", this.element.likes);
    galleryElement.setAttribute(
      "data-title",
      this.#getTitle(this.element.image)
    );

    // create image
    const imgTag = document.createElement("img");
    imgTag.src = `../img/photographers/${photographerID}/${this.#getSource(
      this.element.image
    )}.jpg`;
    imgTag.classList.add("gallery__mediaItem");

    // create container for title, price, likes
    const mediaInfo = document.createElement("div");
    mediaInfo.classList.add("gallery__mediaInfo");

    // create title, price, likes
    const title = document.createElement("p");
    title.textContent = this.#getTitle(this.element.image);
    title.classList.add("gallery__mediaInfo--title");
    const likes = document.createElement("p");
    likes.textContent = this.element.likes;
    likes.classList.add("gallery__mediaInfo--likes");
    const heart = document.createElement("img");
    heart.src = "../img/heart-red.svg";
    heart.alt = "likes";
    heart.classList.add("gallery__mediaInfo--likesImg");
    const price = document.createElement("p");
    price.textContent = `${this.element.price} $`;
    price.classList.add("gallery__mediaInfo--price");

    // append all
    mediaInfo.appendChild(title);
    mediaInfo.appendChild(price);
    mediaInfo.appendChild(likes);
    mediaInfo.appendChild(heart);
    galleryElement.appendChild(imgTag);
    galleryElement.appendChild(mediaInfo);

    return galleryElement;
  }
}

// actual Factory Method in form of a constructor function (called with new)
// client instructs factory what type of media to create by
// passing a type argument into the Factory Method

// exposes the API for video and image factories, i.e. creating new instances

function Factory() {
  this.createMedia = function (element) {
    let type;

    // wieso nicht this.element und this.type in constructor function?
    if ("image" in element) {
      type = "image";
    } else {
      type = "video";
    }
    switch (type) {
      case "image":
        return new Image(element);
      case "video":
        return new Video(element);
    }
  };
}

// function that runs the factory by calling the Factory
// that accesses the media classes to instantiate an object

function galleryElement(element) {
  const factory = new Factory();
  const galleryElement = factory.createMedia(element).render();
  return galleryElement;
}

// create gallery and add Event Listeners
function createGallery(data) {
  data.forEach((item) => gallery.appendChild(galleryElement(item)));
}

// function to add event Listeners to Like Count
function countLikes() {
  const likeButtons = document.getElementsByClassName("gallery__mediaInfo");
  console.log(likeButtons);

  for (let i = 0; i < likeButtons.length; i++) {
    likeButtons[i].addEventListener("click", (e) => {
      const target = e.target;
      const imageLikesEl = target.previousElementSibling;
      const imageLikesCount = parseInt(imageLikesEl.textContent);
      const totalLikesEl = document.getElementById("aside__count");
      const totalLikes = parseInt(totalLikesEl.textContent);
      if (target === likeButtons[i].lastElementChild) {
        imageLikesEl.textContent = imageLikesCount + 1;
        totalLikesEl.textContent = totalLikes + 1;
      }
    });
  }
}

// sorting with merge sort

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
