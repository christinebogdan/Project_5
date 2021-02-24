const main = document.getElementById("main");
const overview = document.getElementById("overview");
const categories = [
  "#portrait",
  "#art",
  "#fashion",
  "#architecture",
  "#sport",
  "#animals",
  "#events",
];

// filter functionality for navigation

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

  for (let i = 0; i < array.length; i++) {
    let tag = document.createElement("li");
    tag.textContent = `#${array[i]}`;
    tag.className = "photographer__tag";
    let srOnlySpan = document.createElement("span");
    srOnlySpan.textContent = "Tag";
    srOnlySpan.className = "sr-only";
    tag.appendChild(srOnlySpan);
    tags.appendChild(tag);
  }
  return tags;
}

// function to build overview tiles for each photographer
function buildOverview(data) {
  data.forEach((person) => {
    // create photographer tile
    let tile = document.createElement("article");
    tile.className = "photographer";

    // create clickable image and headline wrapped in anchor tag //
    let link = document.createElement("a");
    link.className = "photographer__link";
    // create href attribute
    link.href = `./photographers/${person.name}`;
    // set aria-label to person name
    link.setAttribute = ("aria-label", `${person.name}`);
    // create div container for image
    let div = document.createElement("div");
    div.className = "photographer__container";
    link.appendChild(div);
    // create image
    let img = document.createElement("img");
    div.appendChild(img);
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
  });
}

getPhotographerData();
