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
