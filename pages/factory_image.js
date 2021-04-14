class Image {
  constructor(element) {
    this.element = element;
  }

  _getTitle(string) {
    let title = string.substring(string.indexOf("_") + 1);
    title = title.replace(/_/g, " ");
    title = title.replace(/.jpg/g, "");
    return title;
  }

  _getSource(string) {
    let source = this.element.image;
    source = source.replace(/.jpg/g, "");
    return source;
  }

  gallery() {
    // create gallery element
    const galleryElement = document.createElement("div");
    galleryElement.classList.add("gallery__element");
    galleryElement.setAttribute("data-date", this.element.date);
    galleryElement.setAttribute("data-likes", this.element.likes);
    galleryElement.setAttribute("data-id", this.element.id);
    galleryElement.setAttribute(
      "data-title",
      this._getTitle(this.element.image)
    );

    // create image
    const imgTag = document.createElement("img");
    imgTag.src = `../img/photographers/${
      this.element.photographerId
    }/${this._getSource(this.element.image)}.jpg`;
    imgTag.alt = `${this.element.alt}, closeup view`;
    imgTag.classList.add("gallery__mediaItem");

    // create container for title, price, likes
    const mediaInfo = document.createElement("div");
    mediaInfo.classList.add("gallery__mediaInfo");

    // create title, price, likes
    const title = document.createElement("p");
    title.textContent = this._getTitle(this.element.image);
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

  // create lightbox element
  lightbox() {
    // create container
    const carouselItem = document.createElement("div");
    carouselItem.classList.add("carousel__item");
    carouselItem.setAttribute("role", "group");
    carouselItem.setAttribute("aria-roledescription", "slide");
    // carouselItem.setAttribute("aria-label", this.element.alt);
    carouselItem.setAttribute("data-id", this.element.id);

    // create image element
    const carouselImg = document.createElement("img");
    carouselImg.src = `../img/photographers/${
      this.element.photographerId
    }/${this._getSource(this.element.image)}.jpg`;
    carouselImg.alt = this.element.alt;
    carouselImg.classList.add("carousel__image");

    // create title element
    const title = document.createElement("p");
    title.textContent = this._getTitle(this.element.image);
    title.classList.add("carousel__image--title");

    // append all
    carouselItem.appendChild(carouselImg);
    carouselItem.appendChild(title);

    return carouselItem;
  }
}
export default Image;
