import React from "react";

import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginImageTransform,
  FilePondPluginFileValidateSize
);

export default function LoadImage({ setImage }) {
  return (
    <>
      <FilePond
        onupdatefiles={setImage}
        allowImageResize={true}
        imageResizeTargetWidth={640}
        imageResizeTargetHeight={640}
        imageResizeMode="contain"
        imageResizeQuality={0.2}
        maxFileSize="1MB"
        maxFiles={1}
        labelFileSizeNotAllowed="File size too large"
        labelFileTypeNotAllowed="File type not allowed"
      />
    </>
  );
}
