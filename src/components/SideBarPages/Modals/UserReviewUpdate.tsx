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
import UserReviewInterface from "../../../Interfaces/UserReview";
import UserReview from "../../../Interfaces/UserReviewInterface";

interface Props {
  token: string | null;
  open: boolean;
  review: UserReviewInterface;
  onClose: () => void;
  updateReviews: () => void;
  handleOpenSnackBar: (severity: "success" | "error", message: string) => void;
  updatedReviews: (updatedReviews: UserReview[]) => void;
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
}

class UserReviewUpdate extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      title: this.props.review.title,
      date: new Date(this.props.review.date).toLocaleDateString(),
      gameId: 0,
      entry: this.props.review.entry,
      rating: this.props.review.rating,
      open: false,
      openSnackBar: false,
      responseMessage: "",
      severity: "success",
    };
  }

  handleCloseUserReviewUpdate = () => {
    this.setState({
      open: false,
    });
  };

  handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const reviewId = this.props.review.id;
    console.log(reviewId);
    fetch(`http://localhost:4321/review/user/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify({
        title: this.state.title,
        entry: this.state.entry,
        rating: this.state.rating,
      }),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `${this.props.token}`,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.editedReview) {
          this.props.handleOpenSnackBar("error", data.message);
        } else {
          this.props.updatedReviews(data.updatedReviews);
          const message = data.message;
          this.props.handleOpenSnackBar("success", message);
          this.props.onClose();
        }
      });
    this.props.updateReviews();
  };

  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.handleCloseUserReviewUpdate}
        >
          <DialogTitle id="dialogTitle">
            <strong>UPDATE REVIEW</strong>
          </DialogTitle>
          <DialogContent id="signupForm">
            <TextField
              autoFocus
              value={this.state.title}
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
              value={this.state.entry}
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
            <Button onClick={this.props.onClose} id="backButton">
              <strong>Back</strong>
            </Button>
            <Button onClick={this.handleSubmit} id="submitButton">
              <strong>Submit Update</strong>
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default UserReviewUpdate;
