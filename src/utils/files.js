// @flow
import type { FilesMetadata } from "../types";
import { FILE_DISPLAY_MODE } from "../types";

export const FILES_METADATA = "files_metadata";

export function buildFilesMetadata(files: { [string]: string }): FilesMetadata {
  const filesMetadata = {};
  Object.keys(files).forEach(file => {
    filesMetadata[file] = { display: FILE_DISPLAY_MODE.READ_WRITE };
  });
  return filesMetadata;
}

export function getFilesMetadata(files: { [string]: string }): FilesMetadata {
  if (FILES_METADATA in files) {
    const metadata = JSON.parse(files[FILES_METADATA]);
    Object.keys(files).forEach(filename => {
      if (filename === FILES_METADATA) return;
      if (!(filename in metadata)) {
        metadata[filename] = { display: FILE_DISPLAY_MODE.READ_WRITE };
      }
    });
    return metadata;
  }
  return buildFilesMetadata(files);
}
