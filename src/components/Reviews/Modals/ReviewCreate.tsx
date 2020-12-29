import React, { Component } from "react";
import {
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import Alert from "@material-ui/lab/Alert";
import "./ReviewCreate.css";

interface Props {
  token: string | null;
  results: any;
}

interface State {
  title: string;
  date: string;
  gameId: number;
  entry: string;
  rating: number;
  open: boolean;
  openSnackBar: boolean;
  responseMessage: string;
  severity: "success" | "error";
  results: any;
}

class ReviewCreate extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: "",
      date: "",
      gameId: 0,
      entry: "",
      rating: 0,
      open: false,
      openSnackBar: false,
      responseMessage: "",
      severity: "success",
      results: this.props.results,
    };
  }

  handleClickOpenReviewCreate = () => {
    this.setState({
      open: true,
    });
  };

  handleCloseReviewCreate = () => {
    this.setState({
      open: false,
    });
  };

  handleOpenSnackBar = (severity: "success" | "error", message: string) => {
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

  updateRating = (newRating: any) => {
      this.setState({
          rating: newRating
      })
  }

  handleSubmit = (event: any) => {
    event.preventDefault();
    fetch("http://localhost:4321/review/create", {
      method: "POST",
      body: JSON.stringify({
        review: {
          title: this.state.title,
          date: this.state.date,
          entry: this.state.entry,
          rating: this.state.rating,
          gameId: this.props.results.id,
        },
      }),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `${this.props.token}`,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.review) {
          this.handleOpenSnackBar("error", data.message);
        } else {
          const message = data.message;
          this.handleOpenSnackBar("success", message);
          this.handleCloseReviewCreate();
        }
      });
  };

  render() {
    return (
      <div>
        <Button onClick={this.handleClickOpenReviewCreate} id="signupBut">
          <strong>Add a Review</strong>
        </Button>
        <Dialog open={this.state.open} onClose={this.handleCloseReviewCreate}>
          <DialogTitle id="dialogTitle">
            <strong>ADD A REVIEW</strong>
          </DialogTitle>
          <DialogContent id="signupForm">
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              onChange={(e) => this.setState({ title: e.target.value })}
              variant="outlined"
              InputLabelProps={{
                className: "reviewFields",
              }}
            />
            <TextField
              autoFocus
              margin="dense"
              type="date"
              fullWidth
              onChange={(e) => this.setState({ date: e.target.value })}
              variant="outlined"
              InputLabelProps={{
                className: "reviewFields",
              }}
            />
            <TextField
              autoFocus
              margin="dense"
              label="entry"
              type="text"
              fullWidth
              onChange={(e) => this.setState({ entry: e.target.value })}
              variant="outlined"
              multiline
              rowsMax={6}
              InputLabelProps={{
                className: "reviewFields",
              }}
            />
            <Box
              component="fieldset"
              mb={3}
              borderColor="transparent"
              id="ratingsBox"
            >
              <Rating
                value={null}
                precision={0.5}
                onChange={(e, newValue) =>
                  this.setState({ rating: Number(newValue) })
                }
              />
            </Box>
          </DialogContent>
          <DialogActions id="reviewButtons">
            <Button onClick={this.handleCloseReviewCreate} id="backButton">
              <strong>Back</strong>
            </Button>
            <Button onClick={this.handleSubmit} id="submitButton">
              <strong>Submit Review</strong>
            </Button>
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

export default ReviewCreate;
