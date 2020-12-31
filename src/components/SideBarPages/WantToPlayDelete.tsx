import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

interface Props {
    handleOpenSnackBar: (severity: "success" | "error", message: string) => void;
    token: string | null;
    open: boolean;
    onClose: () => void;
}

interface State {
    open: boolean;
    openSnackBar: boolean;
    responseMessage: string;
    severity: "success" | "error";
}

class WantToPlayDelete extends Component<Props, State> {
    constructor (props: any) {
        super(props)
        this.state=({
            open: false,
            openSnackBar: false,
            responseMessage: '',
            severity: 'success',
        })
    }

    removeWTP = (event: any, game: any) => {
        event.preventDefault();
        const wtpId = game.id;
        fetch(`https://localhost:4321/wanttoplay/delete/${wtpId}`, {
          method: "DELETE",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: `${this.props.token}`,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (!data.removedGame) {
              this.props.handleOpenSnackBar("error", data.message);
            } else {
              const message = data.message;
              this.props.handleOpenSnackBar("success", message);
            }
          });
      };

    handleClose = () => {
        this.setState({
            open: false,
        })
    }

    render() {
        return (
          <div>
            <Dialog
              open={this.props.open}
              onClose={this.handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alertTitle"><strong>Are you sure?</strong></DialogTitle>
              <DialogContent>
                <DialogContentText id="alertNotice">
                  Are you sure you want to remove this game from your Want To Play List?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.props.onClose} id="backButton">
                  <strong>Cancel</strong>
                </Button>
                <Button onClick={() => this.removeWTP} id="deleteButton" autoFocus>
                  <strong>Delete</strong>
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        );
      }
}

export default WantToPlayDelete;