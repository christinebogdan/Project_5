import Factory from "./factory.js";

const pathname = window.location.pathname.split("/")[
  window.location.pathname.split("/").length - 1
];
const photographerID = parseInt(pathname.replace(/[^0-9]/g, ""));

// change class of main__article
const articleElement = document.querySelector(".main__article");
const filterButton = document.getElementById("filter-button");
const listbox = document.getElementById("listbox");
const buttonArrow = document.getElementById("filter-button-arrow");
const gallery = document.querySelector(".gallery");
const aside = document.querySelector(".aside");
const modal = document.querySelector(".modal");
const modalOverlay = document.querySelector(".modal__overlay");
// all focusable elements inside modal
const focusableElementsModal = document.querySelectorAll(
  "#close, #firstname, #lastname, #email, #message, #submit"
);
const firstElement = focusableElementsModal[0];
const lastElement = focusableElementsModal[focusableElementsModal.length - 1];
const closeModal = document.querySelector(".modal__close");
const form = document.querySelector(".form");
const lightboxOverlay = document.querySelector(".lightbox");
const carousel = document.querySelector(".carousel");
const carouselItemsWrapper = document.getElementById("carousel__items");
const closeCarousel = document.querySelector(".carousel__controls--close");
const nextImage = document.querySelector(".carousel__controls--right");
const previousImage = document.querySelector(".carousel__controls--left");

const photographerMedia = [];
let totalLikeCount = 0;

// build page content
buildPageContent();

// --------------------------------------------------------- //
// ------------------- PHOTOGRAPHER INFO ------------------- //
// --------------------------------------------------------- //

// get json
async function getData() {
  try {
    const data = await fetch("../data.json");
    const parsedData = await data.json();
    console.log(parsedData);
    return parsedData;
  } catch (e) {
    console.error(e);
  }
}

// get photographer media and total like count
function getPhotographerMedia(media) {
  for (let i = 0; i < media.length; i++) {
    let mediaItem = media[i];
    if (mediaItem.photographerId === photographerID) {
      photographerMedia.push(mediaItem);
      totalLikeCount += mediaItem.likes;
    }
  }
}

// build page content - photographer info, gallery, sorting function, lightbox
async function buildPageContent() {
  const data = await getData();
  let media = data.media;
  const photographers = data.photographers;
  getPhotographerMedia(media);
  createPhotographerInfo(photographers);
  createGallery(photographerMedia);
  sortGallery("popularity");
  createLightBox(photographerMedia);
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
  button.addEventListener("click", (e) => {
    e.stopPropagation();
    openingModal();
  });

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

// Function to show Listbox
function showListBox() {
  const optionName = filterButton.innerText.toLowerCase();
  const currentOption = document.querySelector(`#${optionName}`);
  // set visual focus on currently selected option
  currentOption.classList.add("is-active");
  buttonArrow.style.WebkitTransform = "rotate(180deg)";
  // set aria-expanded
  filterButton.setAttribute("aria-expanded", "true");
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
  buttonArrow.style.WebkitTransform = "rotate(0deg)";
  filterButton.focus();
}

// -------------------- Focus on Button -------------------- //

// Click Event on Button
filterButton.addEventListener("click", (e) => {
  e.stopPropagation();
  showListBox();
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

// Keydown Event on Listbox
listbox.addEventListener("keydown", (e) => {
  e.preventDefault();
  const currentOption = document.querySelector(".is-active");
  let selectedOption;
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
      case "Enter":
        selectedOption = document.querySelector(".is-active");
        filterButton.textContent = selectedOption.innerText;
        hideListBox();
        sortGallery(selectedOption.innerText.toLowerCase());
        break;
      case "Escape":
        for (
          let i = 0;
          i < document.querySelector("#listbox").children.length;
          i++
        ) {
          document
            .querySelector("#listbox")
            .children[i].classList.remove("is-active");
        }

        hideListBox();
        return;
    }
  }
  currentOption.classList.remove("is-active");
  selectedOption.classList.add("is-active");
  currentOption.setAttribute("aria-selected", "false");
  selectedOption.setAttribute("aria-selected", "true");
  listbox.setAttribute("aria-activedescendant", selectedOption.id);
});

// close listbox with click on main
document.querySelector(".main").addEventListener("click", hideListBox);

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

// escape event
modal.addEventListener("keydown", (e) => {
  e.stopPropagation();
  if (e.key === "Escape") {
    closingModal();
  }
});

// close modal with click on overlay
modalOverlay.addEventListener("click", (e) => {
  e.stopPropagation();
  if (e.target === modalOverlay) {
    closingModal();
  }
});

// click events
closeModal.addEventListener("click", (e) => {
  e.stopPropagation();
  closingModal();
});

// keydown events
closeModal.addEventListener("keydown", (e) => {
  if (e.target === closeModal && (e.key === " " || e.key === "Enter")) {
    e.preventDefault();
    closingModal();
  }
});

// -------------- Manage Focus Inside Modal --------------- //

modal.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (document.activeElement === focusableElementsModal[1]) {
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

// -------------------- Print to Console ------------------- //

form.addEventListener("submit", (e) => {
  e.preventDefault();
  e.stopPropagation();
  const firstname = form.querySelector("#firstname");
  const lastname = form.querySelector("#lastname");
  const email = form.querySelector("#email");
  const message = form.querySelector("#message");
  console.log(
    `First name: ${firstname.value}, Last name: ${lastname.value}, Email: ${email.value}, Message: ${message.value}`
  );
  closingModal();
});

// --------------------------------------------------------- //
// ------------------------- GALLERY------------------------ //
// --------------------------------------------------------- //

// Factory Method: "Define an interface for creating an object,
// but let the classes which implement the interface decide which class
// to instantiate. The Factory method lets a class defer
// instantiation to subclasses" (c) GoF.

// --------------- Image & Video Factories --------------- //

// in separate js files

// ----------------- Constructor Function ----------------- //

// actual Factory Method in form of a constructor function (called with new)
// client instructs factory what type of media to create by
// passing a type argument into the Factory Method

// exposes the API for video and image factories, i.e. creating new instances
// function Factory() {
//   this.createMedia = function (element) {
//     let type;

// in separate file

// -------------------- Create Gallery -------------------- //

// function that runs the factory by calling the Factory
// that accesses the media classes to instantiate an object
function galleryElement(element) {
  const factory = new Factory();
  const galleryElement = factory.createMedia(element).gallery();
  galleryElement.firstElementChild.setAttribute("tabindex", "0");
  galleryElement.firstElementChild.addEventListener("click", (e) => {
    e.stopPropagation();
    openLightbox(e);
  });
  galleryElement.firstElementChild.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      openLightbox(e);
    }
  });
  return galleryElement;
}

// create gallery and add event listener to like buttons
function createGallery(data) {
  data.forEach((item) => gallery.appendChild(galleryElement(item)));
  const likeButtons = document.getElementsByClassName(
    "gallery__mediaInfo--likesImg"
  );
  for (let i = 0; i < likeButtons.length; i++) {
    likeButtons[i].addEventListener("click", (e) => {
      e.stopPropagation();
      countLikes(e);
    });
  }
  if (data.length % 3 !== 0) {
    let placeholder = document.createElement("div");
    placeholder.classList.add("gallery__placeholder");
    placeholder.setAttribute("data-date", "1900-01-01");
    placeholder.setAttribute("data-title", "zzz");
    placeholder.setAttribute("data-likes", "0");
    gallery.appendChild(placeholder);
  }
}

// function to add event Listeners to Like Count
function countLikes(e) {
  const target = e.target;
  const imageLikesEl = target.previousElementSibling;
  const imageLikesCount = parseInt(imageLikesEl.textContent);
  const totalLikesEl = document.getElementById("aside__count");
  const totalLikes = parseInt(totalLikesEl.textContent);
  imageLikesEl.textContent = imageLikesCount + 1;
  totalLikesEl.textContent = totalLikes + 1;
}

// --------------------------------------------------------- //
// -------------------------LIGHTBOX------------------------ //
// --------------------------------------------------------- //

// ------------------- Lightbox Elements ------------------- //

// create lightbox elements
function lightBoxElement(element) {
  const factory = new Factory();
  const lightBoxElement = factory.createMedia(element).lightbox();
  return lightBoxElement;
}

// append all lightbox elements to DOM
function createLightBox(data) {
  console.log(data);
  data.forEach((item) => {
    carouselItemsWrapper.appendChild(lightBoxElement(item));
  });
}

// ----------------- Keyboard Trap Lightbox ----------------- //

const focusableElementsLightbox = Array.from(
  document.getElementsByClassName("carousel__controls")
);

carousel.addEventListener("keydown", (e) => {
  const firstLightboxButton = focusableElementsLightbox[0];
  const lastLightboxButton =
    focusableElementsLightbox[focusableElementsLightbox.length - 1];

  if (document.activeElement === firstLightboxButton) {
    if (e.shiftKey && e.key === "Tab") {
      e.preventDefault();
      lastLightboxButton.focus();
    }
  } else if (document.activeElement === lastLightboxButton) {
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      firstLightboxButton.focus();
    }
  }
});

// ---------------- Lightbox Functionality ----------------- //

// function to open lightbox, set initial carousel item, set event listeners and close lightbox
function openLightbox(e) {
  const activeElement = document.activeElement;
  let firstGalleryElement = document.querySelector(".gallery")
    .firstElementChild;
  let lastGalleryElement;
  if (
    document
      .querySelector(".gallery")
      .lastElementChild.classList.contains("gallery__placeholder")
  ) {
    lastGalleryElement = document.querySelector(".gallery").lastElementChild
      .previousElementSibling;
  } else {
    lastGalleryElement = document.querySelector(".gallery").lastElementChild;
  }

  // get all lightbox elements from DOM
  const lightboxElements = Array.from(
    document.querySelectorAll(".carousel__item")
  );

  // get event target id to match lightbox element
  const target = e.target;
  let galleryItem = target.parentElement;
  let galleryItemID = target.parentElement.getAttribute("data-id");

  // find lightbox element with same ID as event target and display
  let carouselItem = lightboxElements.find(
    (element) => element.getAttribute("data-id") === galleryItemID
  );
  lightboxOverlay.style.display = "flex";
  carouselItem.classList.add("active");

  // LIGHTBOX CAROUSEL NEXT AND PREVIOUS CONTROLS EVENT HANDLING

  // click event for next image button
  function keydownNextImage(e) {
    if (e.key === "Enter" || e.key === " ") {
      seeNextImage();
    }
  }

  function seeNextImage() {
    carouselItem.classList.remove("active");
    // if gallery item is last item, then show first item
    if (galleryItem === lastGalleryElement) {
      galleryItem = firstGalleryElement;
    } else {
      galleryItem = galleryItem.nextElementSibling;
    }
    galleryItemID = galleryItem.getAttribute("data-id");
    carouselItem = lightboxElements.find(
      (element) => element.getAttribute("data-id") === galleryItemID
    );
    carouselItem.classList.add("active");
  }

  nextImage.addEventListener("click", seeNextImage);
  nextImage.addEventListener("keydown", keydownNextImage);

  // click event to previous image button
  function keydownPreviousImage(e) {
    if (e.key === "Enter" || e.key === " ") {
      seePreviousImage();
    }
  }

  previousImage.addEventListener("click", seePreviousImage);
  previousImage.addEventListener("keydown", keydownPreviousImage);

  function seePreviousImage() {
    carouselItem.classList.remove("active");
    // if gallery item is first item, then show last item
    if (galleryItem === firstGalleryElement) {
      galleryItem = lastGalleryElement;
    } else {
      galleryItem = galleryItem.previousElementSibling;
    }
    galleryItemID = galleryItem.getAttribute("data-id");
    carouselItem = lightboxElements.find(
      (element) => element.getAttribute("data-id") === galleryItemID
    );
    carouselItem.classList.add("active");
  }

  // LIGHTBOX CAROUSEL CLOSE BUTTON AND ESCAPE EVENT HANDLING

  // set initial focus on lightbox close button
  closeCarousel.focus();

  carousel.addEventListener("keydown", keydownCarousel);

  function keydownCarousel(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeLightbox();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      seeNextImage();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      seePreviousImage();
    }
  }

  // click event on close button
  closeCarousel.addEventListener("click", () => {
    closeLightbox();
  });

  // keydown event on close button
  closeCarousel.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.stopPropagation();
      e.preventDefault();
      closeLightbox();
    }
  });

  // closing lightbox and removing Event Listeners to avoid multiple similar event listeners on one element
  function closeLightbox() {
    lightboxOverlay.style.display = "none";
    lightboxElements.forEach((el) => {
      el.classList.remove("active");
    });
    activeElement.focus();

    // remove keydown event for next and previous image on carousel
    carousel.removeEventListener("keydown", keydownCarousel);

    // remove click event for next image button
    nextImage.removeEventListener("click", seeNextImage);
    nextImage.removeEventListener("keydown", keydownNextImage);

    // remove click event to previous image button
    previousImage.removeEventListener("click", seePreviousImage);
    previousImage.removeEventListener("keydown", keydownPreviousImage);
  }
}
