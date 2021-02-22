const main = document.getElementById("main");
const overview = document.getElementById("overview");

async function getPhotographerData() {
  try {
    const data = await fetch("./data.json");
    const parsedData = await data.json();
    const photographers = parsedData.photographers;
    console.log(photographers);
    buildOverview(photographers);
  } catch (e) {
    console.error(e);
  }
}

// function to build overview tiles for each photographer
function buildOverview(data) {
  data.forEach((person) => {
    // add focusable area
    let focusArea = document.createElement("a");
    // create photographer tile
    let tile = document.createElement("article");
    tile.className = "photographer";
    // add Image, Name, Location, Tagline, Price
    let name = document.createElement("h2");
    name.textContent = person.name;
    name.className = "photographer__name";
    let location = document.createElement("p");
    location.textContent = `${person.city}, ${person.country}`;
    location.className = "photographer__location";
    let tagline = document.createElement("p");
    tagline.textContent = person.tagline;
    tagline.className = "photographer__tagline";
    let price = document.createElement("p");
    price.textContent = `$${person.price}/day`;
    price.className = "photographer__price";
    let tags = document.createElement("div");
    tags.className = "photographer__tags";

    //append all elements to the DOM
    overview.appendChild(focusArea);
    focusArea.appendChild(tile);
    tile.appendChild(name);
    tile.appendChild(location);
    tile.appendChild(tagline);
    tile.appendChild(price);
    tile.appendChild(tags);
  });
}

getPhotographerData();
