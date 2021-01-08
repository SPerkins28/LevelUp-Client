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
import ReviewUpdate from "../Reviews/Modals/ReviewUpdate";
import ReviewDelete from "../Reviews/Modals/ReviewDelete";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Box from "@material-ui/core/Box";
import {
  WithStyles,
  Theme,
  createStyles,
  withStyles,
} from "@material-ui/core/styles";
import "./ReviewsByGame.css";
import APIResponse from "../../Interfaces/APIResponse";
import Reviews from "../../Interfaces/Reviews";
import Review from "../../Interfaces/Review";

const styles = createStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
  })
);

interface Props extends WithStyles<typeof styles> {
  results: APIResponse;
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
  myRef: React.RefObject<HTMLInputElement>;
  results: APIResponse;
  reviews: Review[];
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
  ratingsArr: number[];
  averageRating: number;
  title: string;
  date: string;
  entry: string;
  rating: number;
  openReviewUpdate: boolean;
  openReviewDelete: boolean;
  openSnackBar: boolean;
  responseMessage: string;
  severity: "success" | "error" | "warning";
}

class ReviewsByGame extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      scroll: "paper",
      myRef: React.createRef(),
      results: this.props.results,
      reviews: [],
      ratingsArr: [],
      averageRating: 0,
      title: "",
      date: "",
      entry: "",
      rating: 0,
      openReviewUpdate: false,
      openReviewDelete: false,
      review: {
        id: 0,
        title: "",
        date: "",
        gameId: 0,
        entry: "",
        rating: 0,
        createdAt: "",
        updatedAt: "",
        userId: 0,
      },
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
      .then((response) => response.json())
      .then((reviews: Reviews) => {
        if (!reviews) {
          this.handleOpenSnackBar("error", reviews);
        } else {
          this.setState({
            reviews: reviews.reviews,
          });
          let gameReviews = this.state.reviews;
          let ratingsArr = this.state.ratingsArr;
          gameReviews.forEach((review: Review) => {
            ratingsArr.push(review.rating);
            this.setState({
              ratingsArr: ratingsArr,
            });
          });
          let total = 0;
          for (let i = 0; i < ratingsArr.length; i++) {
            total += ratingsArr[i];
          }
          let avgRating = total / ratingsArr.length;
          this.setState({
            averageRating: Math.round((avgRating + Number.EPSILON) * 100) / 100,
          });
          console.log(this.state.ratingsArr);
          console.log(Math.round((avgRating + Number.EPSILON) * 100) / 100);
          console.log(this.state.averageRating);
        }
      });
  };

  getUpdatedReviews = (updatedReviews: Review[]) => {
    this.setState({
      reviews: updatedReviews,
    });
  };

  handleOpenSnackBar = (
    severity: "success" | "error" | "warning",
    message: string
  ) => {
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
    console.log(this.state.reviews);
    return (
      <>
        <Dialog
          open={this.props.open}
          onClose={this.props.onClose}
          scroll={this.state.scroll}
        >
          <DialogTitle id="reviewHead">
            <strong>REVIEWS</strong>
            <Box id="avgRatingBox">
              <Typography component="legend" id="avgRating">
                <strong>AVERAGE RATING :</strong>
              </Typography>
              <Rating
                id="avgRatingStars"
                value={this.state.averageRating}
                precision={0.5}
                size="small"
                readOnly
              />
            </Box>
          </DialogTitle>
          <DialogContent
            dividers={this.state.scroll === "paper"}
            id="dialogBody"
          >
            <DialogContentText tabIndex={-1} component={"span"}>
              {this.state.reviews.length &&
                this.state.reviews.map((review: Review) => {
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
                            size="small"
                            defaultValue={review.rating}
                            readOnly
                          />
                        </Grid>
                        <Grid item xs={12} md={1} id="reviewActions">
                          <Button
                            id="updateReview"
                            onClick={() =>
                              this.setState({
                                openReviewUpdate: true,
                                review: review,
                              })
                            }
                          >
                            Update
                          </Button>
                          <Button
                            id="deleteReview"
                            onClick={() =>
                              this.setState({
                                openReviewDelete: true,
                                review: review,
                              })
                            }
                          >
                            Delete
                          </Button>
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
            {this.props.token ? (
              <Button onClick={this.toggleViews} id="addReview">
                <strong>Add a Review</strong>
              </Button>
            ) : (
              <Button
                onClick={() =>
                  this.handleOpenSnackBar(
                    "warning",
                    "Please Login or Sign Up to add a review!"
                  )
                }
                id="warningButton"
              >
                <strong>Add a Review</strong>
              </Button>
            )}
          </DialogActions>
        </Dialog>
        {this.state.openReviewUpdate && (
          <ReviewUpdate
            token={this.props.token}
            open={this.state.openReviewUpdate}
            onClose={() => this.setState({ openReviewUpdate: false })}
            review={this.state.review}
            updatedReviews={this.getUpdatedReviews}
            reviews={this.state.reviews}
            updateReviews={this.fetchReviews}
            handleOpenSnackBar={this.handleOpenSnackBar}
          />
        )}
        {this.state.openReviewDelete && (
          <ReviewDelete
            token={this.props.token}
            open={this.state.openReviewDelete}
            onClose={() => this.setState({ openReviewDelete: false })}
            review={this.state.review}
            updatedReviews={this.getUpdatedReviews}
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

export default withStyles(styles)(ReviewsByGame);
