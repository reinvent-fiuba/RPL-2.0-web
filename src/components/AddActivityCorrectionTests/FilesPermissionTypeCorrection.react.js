// @flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Typography from "@material-ui/core/Typography";
import SaveIcon from "@material-ui/icons/Save";
import Fab from "@material-ui/core/Fab";
import { withState } from "../../utils/State";
import type { FilesMetadata } from "../../types";
import { FILE_DISPLAY_MODE } from "../../types";

const styles = theme => ({
  saveFlagsButton: {
    display: "flex",
    marginLeft: "auto",
  },
  bulletTitle: {
    marginRight: "5px",
  },
  filesPermissionsContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  filePermissionsContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "5px",
    marginRight: "15px",
    maxWidth: "600px",
    [theme.breakpoints.down("md")]: {
      alignItems: "inherit",
    },
  },
  fileNameTitle: {
    marginRight: "5px",
    fontFamily: "monospace",
    minWidth: "100px",
    [theme.breakpoints.up("md")]: {
      width: "500px",
    },
  },
});

const FilePermissionTypeButton = withStyles({
  root: {
    backgroundColor: "#5f9caf",
    color: "#fff",
  },
  outlined: {
    color: "#5f9caf",
    backgroundColor: "#fff",
  },
})(Button);

type Props = {
  classes: any,
  handleSaveFilesMetadata: () => void,
  activityFilesMetadata: FilesMetadata,
  onFileMetadataChanged: FilesMetadata => void,
};

function FilesPermissionTypeCorrection(props: Props) {
  const { classes, activityFilesMetadata } = props;
  return (
    <div className={classes.flagsField}>
      <Fab
        aria-label="add"
        size="small"
        color="primary"
        className={classes.saveFlagsButton}
        onClick={() => props.handleSaveFilesMetadata()}
      >
        <SaveIcon />
      </Fab>
      <Typography variant="subtitle1" color="textSecondary" component="h1">
        A continuación se pueden definir los permisos que van a tener los alumnos para cada archivo.
      </Typography>
      <ul>
        <li>
          <Typography
            variant="subtitle2"
            component="h1"
            display="inline"
            className={classes.bulletTitle}
          >
            Lectura y escritura:
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" component="h1" display="inline">
            El alumno podrá editarlos y será parte de la entrega si no lo borra.
          </Typography>
        </li>
        <li>
          <Typography
            variant="subtitle2"
            component="h1"
            display="inline"
            className={classes.bulletTitle}
          >
            Lectura:
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" component="h1" display="inline">
            El alumno podrá ver el archivo pero no editarlo. Formará parte de la entrega.
          </Typography>
        </li>
        <li>
          <Typography
            variant="subtitle2"
            component="h1"
            display="inline"
            className={classes.bulletTitle}
          >
            Oculto:
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" component="h1" display="inline">
            El archivo permanecerá oculto para el alumno pero será agregado a los archivos de la
            entrega del alumno.
          </Typography>
        </li>
      </ul>
      <br />
      <br />
      <div className={classes.filesPermissionsContainer}>
        {Object.keys(activityFilesMetadata).map((filename, idx) => (
          <div key={idx} className={classes.filePermissionsContainer}>
            <Typography
              variant="h6"
              component="h1"
              display="inline"
              className={classes.fileNameTitle}
            >
              {filename}
            </Typography>
            <ButtonGroup
              color="primary"
              aria-label="outlined primary button group"
              display="inline"
            >
              <FilePermissionTypeButton
                color="inherit"
                variant={
                  activityFilesMetadata[filename].display === FILE_DISPLAY_MODE.READ_WRITE
                    ? "contained"
                    : null
                }
                onClick={() => {
                  const newMetadata = activityFilesMetadata;
                  newMetadata[filename].display = FILE_DISPLAY_MODE.READ_WRITE;
                  return props.onFileMetadataChanged(newMetadata);
                }}
              >
                Escritura
              </FilePermissionTypeButton>
              <FilePermissionTypeButton
                color="inherit"
                variant={
                  activityFilesMetadata[filename].display === FILE_DISPLAY_MODE.READ
                    ? "contained"
                    : null
                }
                onClick={() => {
                  const newMetadata = activityFilesMetadata;
                  newMetadata[filename].display = FILE_DISPLAY_MODE.READ;
                  return props.onFileMetadataChanged(newMetadata);
                }}
              >
                Lectura
              </FilePermissionTypeButton>
              <FilePermissionTypeButton
                color="inherit"
                variant={
                  activityFilesMetadata[filename].display === FILE_DISPLAY_MODE.HIDDEN
                    ? "contained"
                    : null
                }
                onClick={() => {
                  const newMetadata = activityFilesMetadata;
                  newMetadata[filename].display = FILE_DISPLAY_MODE.HIDDEN;
                  return props.onFileMetadataChanged(newMetadata);
                }}
              >
                Oculto
              </FilePermissionTypeButton>
            </ButtonGroup>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withState(withStyles(styles)(FilesPermissionTypeCorrection));
