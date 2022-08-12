function saveImage(entity, imageEncoded) {
  if (imageEncoded == null) return;
  const image = JSON.parse(imageEncoded);
  if (image != null && imageMimeType.includes(image.type)) {
    entity.image = new Buffer.from(image.data, "base64");
    entity.imageType = image.type;
  }
}

module.exports = saveImage;
