import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Review from "../../../Interfaces/Review";
import "./ReviewDelete.css";
import APIURL from "../../../helpers/environment";

interface Props {
  token: string | null;
  open: boolean;
  onClose: () => void;
  review: {
    id: number;
    title: string;
    date: string;
    gameId: number;
    entry: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
    userId: number;
  };
  updateReviews: () => void;
  handleOpenSnackBar: (severity: "success" | "error", message: string) => void;
  updatedReviews: (updatedReviews: Review[]) => void;
}

interface State {
  open: boolean;
  openSnackBar: boolean;
  responseMessage: string;
  severity: "success" | "error";
}

class ReviewDelete extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      open: false,
      openSnackBar: false,
      responseMessage: "",
      severity: "success",
    };
  }

  handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const reviewId = this.props.review.id;
    console.log(reviewId);
    const reviewUserId = this.props.review.userId;
    const localUserId = Number(localStorage.getItem("userId"));
    const userRole = localStorage.getItem("role");
    console.log(reviewUserId, localUserId);
    console.log(userRole)
    fetch(`${APIURL}/review/${reviewId}`, {
      method: "DELETE",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `${this.props.token}`,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const errorMessage = data.error;
        if (reviewUserId !== localUserId && userRole !== "admin") {
          console.log(`data${data}`)
          this.props.handleOpenSnackBar("error", errorMessage);
        } else if (!data.updatedReviews) {
          this.props.handleOpenSnackBar("error", data.message);
        } else {
          console.log(`This is data: ${data}`);
          this.props.updatedReviews(data.updatedReviews);
          const message = data.message;
          this.props.handleOpenSnackBar("success", message);
          this.props.onClose();
        }
      });
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alertTitle">
            <strong>Are you sure?</strong>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alertNotice">
              Are you sure you want to delete this review?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onClose} id="backButton">
              <strong>Cancel</strong>
            </Button>
            <Button onClick={this.handleSubmit} id="deleteButton" autoFocus>
              <strong>Delete</strong>
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default ReviewDelete;
