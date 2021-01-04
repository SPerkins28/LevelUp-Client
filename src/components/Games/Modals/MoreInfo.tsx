import React, { Component } from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Snackbar from "@material-ui/core/Snackbar"
import Alert from "@material-ui/lab/Alert";
import "./MoreInfo.css";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

interface Props extends WithStyles<typeof styles> {
  id?: string;
  children?: React.ReactNode;
  onClose: () => void;
  open: boolean;
  results: any;
  token: string | null;
  openReviews: () => void;
  handleClose: () => void;
  handleOpenSnackBar: (severity: "success" | "error", message: string) => void;
}

interface State {
  results: any;
  severity: "success" | "error" | "warning";
  responseMessage: string;
  openSnackBar: boolean;
}

class MoreInfo extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      results: this.props.results,
      severity: "success",
      responseMessage: "",
      openSnackBar: false,
    };
  }

  toggleViews = () => {
    this.props.openReviews();
    this.props.onClose();
  };

  handleOpenSnackBar = (severity: "success" | "error" | "warning", message: string) => {
    this.setState({
      severity: severity,
      responseMessage: message,
      openSnackBar: true,
    });
  };

  handleCloseSnackBar = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      openSnackBar: false,
    });
  };

  addWTP = (event: any) => {
    event.preventDefault();
    const userId = localStorage.getItem("userId");
    const gameId = this.state.results.id;
    fetch("http://localhost:4321/wanttoplay/", {
      method: "POST",
      body: JSON.stringify({
        title: this.props.results.name,
        gameId: this.props.results.id,
        gameImg: this.props.results.background_image,
        releaseDate: this.props.results.released,
        played: false,
        uniqueCheck: `game${gameId}user${userId}`,
        userId: `${userId}`,
      }),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `${this.props.token}`,
      }),
    })
      .then((response) => response.json())
      .then((userWTP: any) => {
        if (!userWTP) {
          this.props.handleOpenSnackBar("error", userWTP.message);
        } else {
          const message = userWTP.message;
          this.props.handleOpenSnackBar("success", message);
        }
      });
  };

  addToLibrary = (event: any) => {
    event.preventDefault();
    const userId = localStorage.getItem("userId");
    const gameId = this.state.results.id;
    fetch("http://localhost:4321/library/", {
      method: "POST",
      body: JSON.stringify({
        title: this.props.results.name,
        gameId: this.props.results.id,
        gameImg: this.props.results.background_image,
        releaseDate: this.props.results.released,
        finished: false,
        uniqueCheck: `game${gameId}user${userId}`,
        userId: `${userId}`,
      }),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `${this.props.token}`,
      }),
    })
      .then((response) => response.json())
      .then((userLibrary: any) => {
        if (!userLibrary) {
          this.props.handleOpenSnackBar("error", userLibrary.message);
        } else {
          const message = userLibrary.message;
          this.props.handleOpenSnackBar("success", message);
        }
      });
  };

  render() {
    return (
      <div>
        <Dialog
          onClose={this.props.onClose}
          aria-labelledby="customized-dialog-title"
          open={this.props.open}
        >
          <DialogTitle id="customized-dialog-title">
            <strong>{this.state.results.name}</strong>
          </DialogTitle>
          <Grid id="infoBar">
            <Typography gutterBottom>
              <strong>Rating:</strong> {this.state.results.esrb_rating.name}
            </Typography>
            <Typography gutterBottom>
              <strong>Genre:</strong> {this.state.results.genres[0].name}
            </Typography>
            <Typography gutterBottom>
              <strong>Release:</strong>{" "}
              {new Date(this.state.results.released).toLocaleDateString()}
            </Typography>
          </Grid>
          <DialogContent dividers>
            <Typography gutterBottom>
              {this.state.results.description.replace(/<\/?p[^>]*>/g, "")}
            </Typography>
          </DialogContent>
          <DialogActions id="moreInfoButtons">
            <Button onClick={() => this.toggleViews()} id="reviewsB">
              <strong>Reviews</strong>
            </Button>
            {this.props.token ?
            (<Button onClick={(event) => this.addWTP(event)} id="wtpB">
              <strong>Add To Want To Play</strong>
            </Button>) :
            (
              <Button
                onClick={() =>
                  this.handleOpenSnackBar(
                    "warning",
                    "Please Login or Sign Up to add this to your Want To Play List"
                  )
                }
                id="wtpWarning"
              >
                <strong>Add To Want To Play</strong>
              </Button>
            )}
            {this.props.token ?
            (<Button onClick={(event) => this.addToLibrary(event)} id="libraryB">
              <strong>Add To Library</strong>
            </Button>) :
            (
              <Button
                onClick={() =>
                  this.handleOpenSnackBar(
                    "warning",
                    "Please Login or Sign Up to add this to your Library"
                  )
                }
                id="libraryWarning"
              >
                <strong>Add To Library</strong>
              </Button>
            )}
          </DialogActions>
        </Dialog>
        <Snackbar
          open={this.state.openSnackBar}
          autoHideDuration={4000}
          onClose={this.handleCloseSnackBar}
        >
          <Alert
            onClose={this.handleCloseSnackBar}
            elevation={6}
            severity={this.state.severity}
            variant="filled"
          >
            {this.state.responseMessage}
          </Alert>
        </Snackbar>
      </div>
    );
  }
}

export default withStyles(styles)(MoreInfo);
