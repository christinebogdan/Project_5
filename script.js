const main = document.getElementById("main");
const nav = document.querySelector(".header__nav");
const overview = document.getElementById("overview");
const navTags = document.querySelectorAll(".header__nav-ul--li");
const firstTag = navTags[0];
const lastTag = navTags[navTags.length - 1];
const categories = {};
const photographerDisplay = {};
const pathname = window.location.pathname;
const photographerID = pathname.replace(/[^0-9]/g, "");

const filter = {
  portrait: "inactive",
  art: "inactive",
  fashion: "inactive",
  architecture: "inactive",
  travel: "inactive",
  sports: "inactive",
  animals: "inactive",
  events: "inactive",
};

function filterFunction(e) {
  // get target
  let target = e.target;
  // get filter name
  let filterName = target.getAttribute("data-name");

  if (filter[filterName] === "inactive") {
    filter[filterName] = "active";
    target.setAttribute("data-state", "active");
    target.setAttribute("aria-selected", "true");
  } else if (filter[filterName] === "active") {
    filter[filterName] = "inactive";
    target.setAttribute("data-state", "inactive");
    target.setAttribute("aria-selected", "false");
  }

  for (let key of Object.keys(filter)) {
    if (filter[key] === "active") {
      for (let person of Object.keys(categories)) {
        if (!categories[person].includes(key)) {
          document.getElementById(person).style.display = "none";
          console.log("hide" + person);
        }
      }
    }
    if (filter[key] === "inactive") {
      for (let person of Object.keys(categories)) {
        if (!categories[person].includes(key)) {
          document.getElementById(person).style.display = "flex";
          console.log("show" + person);
        }
      }
    }
  }
}

// // filter functionality for nav items
// function filterFunction(e) {
//   // get target button
//   let target = e.target;
//   // get filter name
//   let filterName = target.getAttribute("data-name");

//   // when the data-state is inactive, hides the tiles and sets data-state to active
//   if (target.getAttribute("data-state") === "inactive") {
//     target.setAttribute("data-state", "active");
//     target.setAttribute("aria-selected", "true");
//     // loop over photographers and their categories
//     for (let key of Object.keys(categories)) {
//       // select photographer and their tile that matches the current key
//       let photographerTile = document.getElementById(key);
//       // when photographer does not have current category, hide tile
//       if (!categories[key].some((el) => el === filterName)) {
//         photographerTile.style.display = "none";
//       }
//     }
//   } else if (target.getAttribute("data-state") === "active") {
//     target.setAttribute("data-state", "inactive");
//     target.setAttribute("aria-selected", "false");

//     // loop over photographers and their categories
//     for (let key of Object.keys(categories)) {
//       // select photographer and their tile that matches the current key
//       let photographerTile = document.getElementById(key);
//       // remove all matching previously hidden tiles
//       if (!categories[key].some((el) => el === filterName)) {
//         photographerTile.style.display = "flex";
//       }
//     }
//   }
// }

// how can I use this function in my buildOverview function (with async await?)
async function getPhotographerData() {
  try {
    const data = await fetch("./data.json");
    const parsedData = await data.json();
    const photographers = parsedData.photographers;
    console.log(photographers);
    buildOverview(photographers);
    return photographers;
  } catch (e) {
    console.error(e);
  }
}

// function to build tags in photographer overview
function buildTags(array) {
  let tags = document.createElement("ul");
  tags.className = "photographer__tags";
  // add Event Listeners (how can I reduce duplicate code of filter in nav?)

  tags.addEventListener("click", filterFunction);
  tags.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      filterFunction(e);
    }
  });

  for (let i = 0; i < array.length; i++) {
    let tag = document.createElement("li");
    tag.textContent = `#${array[i]}`;
    tag.className = "photographer__tag";
    tag.setAttribute("data-name", array[i]);
    tag.setAttribute("data-state", "inactive");
    let srOnlySpan = document.createElement("span");
    srOnlySpan.textContent = "Tag";
    srOnlySpan.className = "sr-only";
    tag.appendChild(srOnlySpan);
    tags.appendChild(tag);
  }
  return tags;
}

// function to build overview tiles for each photographer
// and the object (id and tags) for filter functionality
function buildOverview(data) {
  for (let i = 0; i < data.length; i++) {
    let person = data[i];
    // populate photographerCategories object
    categories[`${person.id}`] = person.tags;
    photographerDisplay[`${person.id}`] = "display";
    // let obj = {};
    // obj[`${person.id}`] = person.tags;
    // photographerCategories.push(obj);

    // create photographer tile
    let tile = document.createElement("article");
    tile.className = "photographer";
    tile.id = `${person.id}`;

    // create clickable image and headline wrapped in anchor tag //
    let link = document.createElement("a");
    link.className = "photographer__link";
    link.setAttribute("aria-label", person.name);

    // create href attribute
    link.href = `./pages/${person.name.replace(/ /g, "_")}_${person.id}.html`;

    // set aria-label to person name
    link.setAttribute = ("aria-label", `${person.name}`);

    // create image
    let img = document.createElement("img");
    link.appendChild(img);
    img.src = `./img/photographers/ID_Photos/${person.portrait}`;

    // How to set empty alt attribute
    img.setAttribute("alt", `""`);
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
}

// manage focus on navigation
nav.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    firstTag.focus();
  }
});

// manage focus inside navigation and add filter functionality
for (let i = 0; i < navTags.length; i++) {
  // add filter functionality to navigation, mouse and keyboard
  navTags[i].addEventListener("click", filterFunction);
  navTags[i].addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      filterFunction(e);
    }
  });

  // manage focus inside navigation via keyboard
  navTags[i].addEventListener("keydown", (e) => {
    e.stopPropagation();
    let target = e.target;

    if (e.key === "ArrowRight") {
      if (target === lastTag) {
        firstTag.focus();
      } else {
        navTags[i + 1].focus();
      }
    }
    if (e.key === "ArrowLeft") {
      if (target === firstTag) {
        lastTag.focus();
      } else {
        navTags[i - 1].focus();
      }
    }
  });
}

// build page's main content
getPhotographerData();
