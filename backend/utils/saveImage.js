const imageMimeType = ["image/jpeg", "image/png", "image/gif"];
function saveImage(entity, imageEncoded) {
  if (imageEncoded !== null) {
    const image = imageEncoded.split(";base64,").pop();
    // const image = JSON.parse(imageEncoded);
    if (image != null && imageMimeType.includes(image.type)) {
      entity.image = new Buffer.from(image.data, "base64");
      entity.imageType = image.type;
    }
  }
}

module.exports = saveImage;
