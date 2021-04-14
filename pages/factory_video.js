class Video {
  constructor(element) {
    this.element = element;
  }

  _getTitle(string) {
    let title = string.substring(string.indexOf("_") + 1);
    title = title.replace(/_/g, " ");
    title = title.replace(/.mp4/g, "");
    return title;
  }

  _getSource(string) {
    let source = string;
    source = source.replace(/.mp4/g, "");
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
      this._getTitle(this.element.video)
    );

    // create video
    const videoTag = document.createElement("video");
    videoTag.classList.add("gallery__mediaItem");
    const sourceTag = document.createElement("source");
    sourceTag.src = `../img/photographers/${
      this.element.photographerId
    }/${this._getSource(this.element.video)}.mp4`;
    videoTag.appendChild(sourceTag);
    videoTag.setAttribute("aria-label", `${this.element.alt}, closeup view`);

    // create container for title, price, likes
    const mediaInfo = document.createElement("div");
    mediaInfo.classList.add("gallery__mediaInfo");

    // create title, price, likes
    const title = document.createElement("p");
    title.textContent = this._getTitle(this.element.video);
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

  // create lightbox element
  lightbox() {
    // create container
    const carouselItem = document.createElement("div");
    carouselItem.classList.add("carousel__item");
    carouselItem.setAttribute("role", "group");
    carouselItem.setAttribute("aria-roledescription", "slide");
    // carouselItem.setAttribute("aria-label", this.element.alt);
    carouselItem.setAttribute("data-id", this.element.id);

    // create video element
    const carouselVid = document.createElement("video");
    carouselVid.classList.add("carousel__video");
    carouselVid.setAttribute("controls", "true");
    carouselVid.setAttribute("aria-label", this.element.alt);

    // create video source element
    const source = document.createElement("source");
    source.src = `../img/photographers/${
      this.element.photographerId
    }/${this._getSource(this.element.video)}.mp4`;
    carouselVid.appendChild(source);

    // create title
    const title = document.createElement("p");
    title.textContent = this._getTitle(this.element.video);
    title.classList.add("carousel__image--title");

    // append all
    carouselItem.appendChild(carouselVid);
    carouselItem.appendChild(title);

    return carouselItem;
  }
}

export default Video;
