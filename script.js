const overview = document.getElementById("overview");
const navTags = document.querySelectorAll(".header__nav-ul--li");
const categories = {};
const photographerDisplay = {};
const url = window.location.href;

// --------------------------------------------------------- //
// ------------------- NAVIGATION FOCUS -------------------- //
// --------------------------------------------------------- //

// manage focus inside navigation and add filter functionality
for (let i = 0; i < navTags.length; i++) {
  // add filter functionality to navigation, mouse and keyboard
  navTags[i].addEventListener("click", filterFunction);
  navTags[i].addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      filterFunction(e);
    }
  });
}

// --------------------------------------------------------- //
// -------------------- FILTER FUNCTION -------------------- //
// --------------------------------------------------------- //

function filterFunction(e) {
  let target;
  {
    if (e.type === "click") {
      target = e.target;
    } else if (e.type === "keydown") {
      target = e.target.firstElementChild;
    }
  }
  let filterName = target.getAttribute("data-name");
  let filterState = target.getAttribute("data-state");

  if (filterState === "inactive") {
    navTags.forEach((tag) => {
      tag.setAttribute("data-state", "inactive");
      tag.setAttribute("aria-current", "false");
    });
    target.setAttribute("data-state", "active");
    target.setAttribute("aria-current", "true");
    for (let person of Object.keys(categories)) {
      let DOMElement = document.getElementById(person);
      if (categories[person].includes(filterName)) {
        DOMElement.style.display = "flex";
      } else {
        DOMElement.style.display = "none";
      }
    }
  } else {
    target.setAttribute("data-state", "inactive");
    target.removeAttribute("aria-current");
    // target.setAttribute("aria-selected", "false");
    for (let person of Object.keys(categories)) {
      let DOMElement = document.getElementById(person);
      DOMElement.style.display = "flex";
    }
  }
}

// --------------------------------------------------------- //
// ------------------- PHOTOGRAPHER INFO ------------------- //
// --------------------------------------------------------- //

// get data from json
async function getData() {
  try {
    const data = await fetch("./data.json");
    const parsedData = await data.json();
    const photographers = parsedData.photographers;
    console.log(photographers);
    return photographers;
  } catch (e) {
    console.error(e);
  }
}

// build page content
async function buildPageContent() {
  const data = await getData();
  buildOverview(data);
}

// build tags in phtographer tiles
function buildTags(array) {
  let tags = document.createElement("ul");
  tags.className = "photographer__tags";

  tags.addEventListener("click", filterFunction);
  tags.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      filterFunction(e);
    }
  });

  for (let i = 0; i < array.length; i++) {
    // create tag list element
    let tag = document.createElement("li");
    if (array[i] === "sport") {
      tag.textContent = "#sports";
    } else {
      tag.textContent = `#${array[i]}`;
    }
    tag.className = "photographer__tag";
    tag.setAttribute("data-name", array[i]);
    tag.setAttribute("data-state", "inactive");
    tag.setAttribute("role", "link");
    tag.setAttribute("tabindex", "0");

    // create span element
    let srOnlySpan = document.createElement("span");
    srOnlySpan.textContent = "Tag";
    srOnlySpan.className = "sr-only";

    // append all
    tag.appendChild(srOnlySpan);
    tags.appendChild(tag);
  }
  return tags;
}

// function to build overview tiles for each photographer
// and the categories object (id and tags) for filter functionality
function buildOverview(data) {
  for (let i = 0; i < data.length; i++) {
    let person = data[i];

    // scan person.tags array for sport tag and replace with sports
    if (person.tags.includes("sport")) {
      person.tags.splice(person.tags.indexOf("sport"), 1, "sports");
    }

    // populate photographerCategories object
    categories[`${person.id}`] = person.tags;
    photographerDisplay[`${person.id}`] = "display";

    // create photographer tile
    let tile = document.createElement("article");
    tile.className = "photographer";
    tile.id = `${person.id}`;

    // create clickable image and headline wrapped in anchor tag //
    let link = document.createElement("a");
    link.className = "photographer__link";

    // set aria-label to person name
    link.setAttribute("aria-label", person.name);

    // create href attribute
    link.href = `./pages/${person.name.replace(/ /g, "_")}_${person.id}.html`;

    // create image
    let img = document.createElement("img");
    link.appendChild(img);
    img.src = `./img/photographers/ID_Photos/${person.portrait}`;

    // How to set empty alt attribute
    img.setAttribute("alt", "");
    img.className = "photographer__img";

    // create name
    let name = document.createElement("h2");
    name.textContent = person.name;
    name.className = "photographer__name";
    link.appendChild(name);

    // create location
    let location = document.createElement("p");
    location.textContent = `${person.city}, ${person.country}`;
    location.className = "photographer__location";

    //create tagline
    let tagline = document.createElement("p");
    tagline.textContent = person.tagline;
    tagline.className = "photographer__tagline";

    // create price
    let price = document.createElement("p");
    price.textContent = `$${person.price}/day`;
    price.className = "photographer__price";

    // create tags
    let tags = buildTags(person.tags);

    //append all to DOM
    overview.appendChild(tile);
    tile.appendChild(link);
    tile.appendChild(location);
    tile.appendChild(tagline);
    tile.appendChild(price);
    tile.appendChild(tags);
  }

  // if url contains parameter, set filter to parameter
  if (url.includes("?")) {
    const urlPara = url.substring(url.indexOf("?") + 1);
    if (urlPara) {
      document.querySelector(`[data-name=${urlPara}]`).click();
      document.querySelector(`[data-name=${urlPara}]`).parentNode.focus();
    }
  }
}

buildPageContent();
