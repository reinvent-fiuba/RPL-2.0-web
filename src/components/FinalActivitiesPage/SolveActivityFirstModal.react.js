// @flow
import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";

type Props = {
  open: boolean,
  teacherMode: boolean,
  onBackdropClicked: void => void,
  onGoBackClicked: void => void,
};

/**
 * Dialog to show if someone attemps to see all the final solutions but hasn't finished its own first
 */
export default function SolveActivityFirstModal(props: Props) {
  const { open, teacherMode, onBackdropClicked, onGoBackClicked } = props;
  return (
    <Dialog
      open={open}
      onBackdropClick={() => onBackdropClicked()}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth="sm"
    >
      <DialogTitle id="scroll-dialog-title">
        {teacherMode
          ? "Todavía no hay soluciones finales"
          : "Todavía no podés ver las otras soluciones finales"}
      </DialogTitle>
      {!teacherMode && (
        <DialogContent style={{ alignSelf: "center" }}>
          <Typography>Antes tenés que resolver la actividad</Typography>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={() => onGoBackClicked()} color="primary">
          Volver
        </Button>
      </DialogActions>
    </Dialog>
  );
}
