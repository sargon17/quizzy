import React from "react";

import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageResize from "filepond-plugin-image-resize";

registerPlugin(FilePondPluginImagePreview, FilePondPluginImageResize);

export default function LoadImage({ setImage }) {
  return (
    <>
      <FilePond
        onupdatefiles={setImage}
        allowImageResize
        imageResizeTargetWidth={640}
      />
    </>
  );
}
