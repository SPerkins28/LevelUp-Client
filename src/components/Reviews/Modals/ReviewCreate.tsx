import React, { Component } from "react";
import {
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import "./ReviewCreate.css";

interface Props {
  token: string | null;
  results: any;
  open: boolean;
  onClose: () => void;
  openReviews: () => void;
  showReviewCreate: () => void;
  handleClose: () => void;
  handleOpenSnackBar: (severity: "success" | "error", message: string) => void;
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

  toggleViews = () => {
    this.props.handleClose();
    this.props.showReviewCreate();
  };

  toggleViewsBack = () => {
    this.props.onClose();
    this.props.openReviews();
  };

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
          this.props.handleOpenSnackBar("error", data.message);
        } else {
          const message = data.message;
          this.props.handleOpenSnackBar("success", message);
          this.toggleViewsBack();
        }
      });
  };

  render() {
    return (
      <div>
        <Dialog open={this.props.open} onClose={this.handleCloseReviewCreate}>
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
                name="rating"
                value={this.state.rating}
                onChange={(e, newValue) =>
                  this.setState({ rating: Number(newValue) })
                }
              />
            </Box>
          </DialogContent>
          <DialogActions id="reviewButtons">
            <Button onClick={this.toggleViewsBack} id="backButton">
              <strong>Back</strong>
            </Button>
            <Button onClick={this.handleSubmit} id="submitButton">
              <strong>Submit Review</strong>
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default ReviewCreate;
