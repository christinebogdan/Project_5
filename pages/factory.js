import Video from "./factory_video.js";
import Image from "./factory_image.js";

function Factory() {
  this.createMedia = function (element) {
    let type;

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

export default Factory;
