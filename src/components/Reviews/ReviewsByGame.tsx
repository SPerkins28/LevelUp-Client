import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Rating from "@material-ui/lab/Rating";
import ReviewUpdate from '../Reviews/Modals/ReviewUpdate';
import ReviewDelete from '../Reviews/Modals/ReviewDelete'
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import "./ReviewsByGame.css";

interface Props {
  results: any;
  token: string | null;
  open: boolean;
  onClose: () => void;
  openReviewCreate: () => void;
  openMoreInfo: () => void;
  showReviews: () => void;
  handleClose: () => void;
}

interface State {
  scroll: DialogProps["scroll"];
  myRef: any;
  results: any;
  reviews: any;
  review: any;
  title: string;
  date: string;
  entry: string;
  rating: number;
  openReviewUpdate: boolean;
  openReviewDelete: boolean;
  openSnackBar: boolean;
  responseMessage: string;
  severity: "success" | "error";
}

class ReviewsByGame extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      scroll: "paper",
      myRef: React.createRef(),
      results: this.props.results,
      reviews: [],
      title: "",
      date: "",
      entry: "",
      rating: 0,
      openReviewUpdate: false,
      openReviewDelete: false,
      review: {},
      openSnackBar: false,
      responseMessage: "",
      severity: "success",
    };
  }

  toggleViewsBack = () => {
    this.props.onClose();
    this.props.openMoreInfo();
  };

  toggleViews = () => {
    this.props.onClose();
    this.props.openReviewCreate();
  };

  fetchReviews = () => {
    const gameId = this.state.results.id;
    fetch(`http://localhost:4321/review/games/${gameId}`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
      .then((res: any) => res.json())
      .then((reviews: any) => {
        this.setState({
          reviews: reviews.reviews,
        });
      });
  }

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

  componentDidMount = () => {
    this.fetchReviews();
  };

  render() {
    return (
      <>
        <Dialog
          open={this.props.open}
          onClose={this.props.onClose}
          scroll={this.state.scroll}
        >
          <DialogTitle id="reviewHead">
            <strong>REVIEWS</strong>
          </DialogTitle>
          <DialogContent
            dividers={this.state.scroll === "paper"}
            id="dialogBody"
          >
            <DialogContentText tabIndex={-1} component={"span"}>
              {this.state.reviews.map((review: any) => {
                return (
                  <React.Fragment key={review.id}>
                    <Grid container spacing={2} id="titleBox">
                      <Grid item xs={12} md={2}>
                        <Typography id="reviewTitle">
                          <strong>{review.title}</strong>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography id="usernameText">
                          {review.user.username}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography id="entryText">{review.entry}</Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography id="dateText">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Rating
                          id="rating"
                          defaultValue={review.rating}
                          readOnly
                        />
                      </Grid>
                      <Grid item xs={12} md={1} id="reviewActions">
                        <Button onClick={() => this.setState({openReviewUpdate: true, review: review})}>Update</Button>
                        <Button onClick={() => this.setState({openReviewDelete: true, review: review})}>Delete</Button>
                      </Grid>
                    </Grid>
                  </React.Fragment>
                );
              })}
            </DialogContentText>
          </DialogContent>
          <DialogActions id="reviewButtons">
            <Button onClick={this.toggleViewsBack} id="reviewBack">
              <strong>Back</strong>
            </Button>
            {/* Link to review create modal & maybe add button for add to wtp or library */}
            <Button onClick={this.toggleViews} id="addReview">
              <strong>Add a Review</strong>
            </Button>
          </DialogActions>
        </Dialog>
        {this.state.openReviewUpdate && (
          <ReviewUpdate
            token={this.props.token}
            results={this.props.results}
            open={this.state.openReviewUpdate}
            onClose={() => this.setState({ openReviewUpdate: false })}
            review={this.state.review}
            updateReviews={this.fetchReviews}
            handleOpenSnackBar={this.handleOpenSnackBar}
          />
        )}
        {this.state.openReviewDelete && (
          <ReviewDelete 
            token={this.props.token}
            results={this.props.results}
            open={this.state.openReviewDelete}
            onClose={() => this.setState({ openReviewDelete: false })}
            review={this.state.review}
            updateReviews={this.fetchReviews}
            handleOpenSnackBar={this.handleOpenSnackBar}
          />
        )}
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
      </>
    );
  }
}

export default ReviewsByGame;
