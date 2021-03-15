const pathname = window.location.pathname.split("/")[
  window.location.pathname.split("/").length - 1
];
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
const lightboxOverlay = document.querySelector(".lightbox");
const carousel = document.querySelector(".carousel");
const carouselItems = document.getElementById("carousel__items");
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
  button.addEventListener("click", openingModal);

  wrapper.appendChild(textContainer);
  wrapper.appendChild(button);

  const img = document.createElement("img");
  img.src = `../img/photographers/ID_Photos/${photographer.portrait}`;
  img.alt = " ";
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
filterButton.addEventListener("click", showListBox);

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
  listbox.setAttribute("aria-activedescendant", selectedOption.id);
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
  if (e.key === "Escape") {
    closingModal();
  }
});

// close modal with click on overlay
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    closingModal();
  }
});

// click events
closeModal.addEventListener("click", closingModal);

// keydown events
closeModal.addEventListener("keydown", (e) => {
  if (e.target === closeModal && (e.key === " " || e.key === "Enter")) {
    e.preventDefault();
    closingModal();
  }
});

// -------------- Manage Focus Inside Modal --------------- //

modal.addEventListener("keydown", (e) => {
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

// -------------------- Print to Console ------------------- //

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

// --------------- Image & Video Factories --------------- //

class Video {
  constructor(element) {
    this.element = element;
  }

  #getTitle(string) {
    let title = string.substring(string.indexOf("_") + 1);
    title = title.replace(/_/g, " ");
    title = title.replace(/.mp4/g, "");
    return title;
  }

  #getSource(string) {
    let source = string;
    source = source.replace(/.mp4/g, "");
    return source;
  }

  gallery() {
    // create container for gallery element
    const galleryElement = document.createElement("div");
    galleryElement.classList.add("gallery__element");
    galleryElement.setAttribute("data-date", this.element.date);
    galleryElement.setAttribute("data-likes", this.element.likes);
    galleryElement.setAttribute("data-id", this.element.id);
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

  // create container for lightbox element
  lightbox() {
    // create container
    const carouselItem = document.createElement("div");
    carouselItem.classList.add("carousel__item");
    carouselItem.setAttribute("role", "group");
    carouselItem.setAttribute("aria-roledescription", "slide");
    carouselItem.setAttribute("aria-label", this.element.alt);
    carouselItem.setAttribute("data-id", this.element.id);

    // create video element
    const carouselVid = document.createElement("video");
    carouselVid.classList.add("carousel__video");
    carouselVid.setAttribute("controls", "true");

    // create video source element
    const source = document.createElement("source");
    source.src = `../img/photographers/${photographerID}/${this.#getSource(
      this.element.video
    )}.mp4`;
    carouselVid.appendChild(source);

    // create title
    const title = document.createElement("p");
    title.textContent = this.#getTitle(this.element.video);
    title.classList.add("carousel__image--title");

    // append all
    carouselItem.appendChild(carouselVid);
    carouselItem.appendChild(title);

    return carouselItem;
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

  gallery() {
    // create container for gallery element
    const galleryElement = document.createElement("div");
    galleryElement.classList.add("gallery__element");
    galleryElement.setAttribute("data-date", this.element.date);
    galleryElement.setAttribute("data-likes", this.element.likes);
    galleryElement.setAttribute("data-id", this.element.id);
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

  // create container for lightbox element
  lightbox() {
    // create container
    const carouselItem = document.createElement("div");
    carouselItem.classList.add("carousel__item");
    carouselItem.setAttribute("role", "group");
    carouselItem.setAttribute("aria-roledescription", "slide");
    carouselItem.setAttribute("aria-label", this.element.alt);
    carouselItem.setAttribute("data-id", this.element.id);

    // create image element
    const carouselImg = document.createElement("img");
    carouselImg.src = `../img/photographers/${photographerID}/${this.#getSource(
      this.element.image
    )}.jpg`;
    carouselImg.alt = " ";
    carouselImg.classList.add("carousel__image");

    // create title element
    const title = document.createElement("p");
    title.textContent = this.#getTitle(this.element.image);
    title.classList.add("carousel__image--title");

    // append all
    carouselItem.appendChild(carouselImg);
    carouselItem.appendChild(title);

    return carouselItem;
  }
}

// -------------------- Constructor Function ------------------- //

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
  const galleryElement = factory.createMedia(element).gallery();
  galleryElement.firstElementChild.setAttribute("tabindex", "0");
  galleryElement.firstElementChild.addEventListener("click", openLightbox);
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
    likeButtons[i].addEventListener("click", countLikes);
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
    carouselItems.appendChild(lightBoxElement(item));
  });
}

// ------------------- Focus in Lightbox ------------------- //

const focusableElementsLightbox = Array.from(
  document.getElementsByClassName("carousel__controls")
);

carousel.addEventListener("keydown", (e) => {
  console.log("carousel event listener activated");
  const firstElement = focusableElementsLightbox[0];
  const lastElement =
    focusableElementsLightbox[focusableElementsLightbox.length - 1];

  if (document.activeElement === firstElement) {
    console.log("closeModal is active Element");
    if (e.shiftKey && e.key === "Tab") {
      e.preventDefault();
      lastElement.focus();
      console.log("shiftkey pressed");
      if (e.key === "Tab") {
        e.preventDefault();
        console.log("Shift and Tab pressed");
        lastElement.focus();
      }
    }
  }

  if (document.activeElement === lastElement) {
    if (e.key === "Tab") {
      e.preventDefault();
      firstElement.focus();
    }
  }
});
// carousel.addEventListener("keydown", (e) => {
//   console.log("carousel eventlistener");
//   if (e.key === "Tab") {
//     if (e.shiftKey) {
//       if (document.activeElement === closeCarousel) {
//         e.preventDefault();
//         nextImage.focus();
//       }
//     }
//     if (document.activeElement === nextImage) {
//       e.preventDefault();
//       closeModal.focus();
//     }
//   }
// });

// ---------------- Lightbox functionality ----------------- //

// function to open lightbox, set initial caroulse item, set event listeners
function openLightbox(e) {
  const activeElement = document.activeElement;
  const firstGalleryElement = document.querySelector(".gallery")
    .firstElementChild;
  const lastGalleryElement = document.querySelector(".gallery")
    .lastElementChild;

  // get all lightbox elements
  const lightboxElements = Array.from(
    document.querySelectorAll(".carousel__item")
  );
  const target = e.target;
  let galleryItem = target.parentElement;
  let galleryItemID = target.parentElement.getAttribute("data-id");

  // find lightbox element with same ID as event target
  let carouselItem = lightboxElements.find(
    (element) => element.getAttribute("data-id") === galleryItemID
  );
  lightboxOverlay.style.display = "flex";
  carouselItem.classList.add("active");
  // if (target.classList.contains("gallery__mediaItem")) {

  // }

  // set initial focus on button to close lightbox
  closeCarousel.focus();

  // click event to close lightbox
  closeCarousel.addEventListener("click", () => {
    lightboxOverlay.style.display = "none";
    lightboxElements.forEach((el) => {
      el.classList.remove("active");
      activeElement.focus();
    });
  });

  // keydown event to close lightbox and manage keyboard trap
  closeCarousel.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === "Escape" || e.key === " ") {
      e.stopPropagation();
      e.preventDefault();
      lightboxOverlay.style.display = "none";
      lightboxElements.forEach((el) => {
        el.classList.remove("active");
      });
      activeElement.focus();
    }
  });

  // click event for next image button
  nextImage.addEventListener("click", seeNextImage);

  // click event to previous image button
  previousImage.addEventListener("click", seePreviousImage);

  function seeNextImage(e) {
    carouselItem.style.display = "none";
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
    carouselItem.style.display = "block";
  }

  function seePreviousImage(e) {
    carouselItem.style.display = "none";
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
    carouselItem.style.display = "block";
  }
}
