// @flow
import type { FilesMetadata, Activity } from "../types";
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

export function prepareInitialCode(activity: Activity) {
  const code = activity.initial_code;
  const metadata = getFilesMetadata(activity.initial_code);
  if (activity.language === "python" && activity.is_iotested) {
    code["assignment_main.py"] = code["assignment_main.py"] || "# tu codigo";
    metadata["assignment_main.py"] = {
      display: FILE_DISPLAY_MODE.WRITE_CANT_DELETE,
    };
    code[FILES_METADATA] = JSON.stringify(metadata);
  }
  return code;
}

export function getNewSelectedEditor(code: { [string]: string }): string {
  const editableCodeEditors = Object.keys(code).filter(fileName => fileName !== FILES_METADATA);
  if (editableCodeEditors.length > 0) {
    return editableCodeEditors[0]; // array destructuring === array[0]
  }
  return "main";
}
