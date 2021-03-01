const pathname = window.location.pathname;
const photographerID = pathname.replace(/[^0-9]/g, "");

async function getPhotographerData() {
  try {
    const data = await fetch("../data.json");
    const parsedData = await data.json();
    console.log(parsedData);

    return parsedData;
  } catch (e) {
    console.error(e);
  }
}
