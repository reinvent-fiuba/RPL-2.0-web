// @flow
import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";

type Props = {
  open: boolean,
};

export default function SolveActivityFirstModal(props: Props) {
  const { open } = props;
  return (
    <Dialog
      open={open}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth="sm"
    >
      <DialogTitle id="scroll-dialog-title">
        Todavía no podés ver las otras soluciones finales
      </DialogTitle>
      <DialogContent style={{ alignSelf: "center" }}>
        <Typography>Antes tenés que resolver la actividad</Typography>
      </DialogContent>
    </Dialog>
  );
}
