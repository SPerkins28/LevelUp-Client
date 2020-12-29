import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Rating from "@material-ui/lab/Rating";
import './ReviewsByGame.css';
import ReviewCreate from "./Modals/ReviewCreate";

interface Props {
    results: any,
    token: string | null,
    open: boolean,
    onClose: () => void
}

interface State {
    open: boolean;
    scroll: DialogProps["scroll"];
    myRef: any;
    results: any,
    reviews: any,
    title: string,
    date: string,
    entry: string,
    rating: number,
}

class ReviewsByGame extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      open: false,
      scroll: "paper",
      myRef: React.createRef(),
      results: this.props.results,
      reviews: [],
      title: '',
      date: '',
      entry: '',
      rating: 0,
    };
  }

  handleClickOpen = (scrollType: DialogProps["scroll"]) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    this.setState({
          open: true,
          scroll: scrollType,
        });
  };

  handleBack = () => {
    this.setState({
          open: false
        })
  }

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  // updateReview = (event: any) => {
  //   event.preventDefault();
  //   fetch('http://localhost:4321/review/', {
  //     method: 'PUT',
  //     body: JSON.stringify({
  //       title: this.state.title,
  //       date: this.state.date,
  //       entry: this.state.entry,
  //       rating: this.state.rating,
  //     })
  //   })
  // }

  componentDidMount = () => {
    const gameId = this.state.results.id
    fetch(`http://localhost:4321/review/games/${gameId}`, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
    .then((res: any) => res.json())
    .then((reviews: any) => {
        this.setState({
            reviews: reviews.reviews
        })
    })
  }

  render() {
    return (
      <div>
        <Button onClick={this.handleClickOpen("paper")}>Reviews</Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          scroll={this.state.scroll}
        >
          <DialogTitle id="reviewHead"><strong>REVIEWS</strong></DialogTitle>
          <DialogContent dividers={this.state.scroll === "paper"} id="dialogBody">
            <DialogContentText
              tabIndex={-1}
            >
              {this.state.reviews.map((review: any) => {
                  return (
                    <React.Fragment key={review.id}>
                    <Grid container spacing={2} id="titleBox">
                      <Grid item xs={2}>
                      <Typography id="reviewTitle"><strong>{review.title}</strong></Typography>
                      </Grid>
                      <Grid item xs={2}>
                      <Typography id="usernameText">{review.user.username}</Typography>
                      </Grid>
                      <Grid item xs={3}>
                      <Typography id="entryText">{review.entry}</Typography>
                      </Grid>
                      <Grid item xs={2}> 
                      <Typography id="dateText">{new Date(review.createdAt).toLocaleDateString()}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                      <Rating id="rating" defaultValue={review.rating} readOnly />
                      </Grid>
                      <Grid item xs={1}>
                        <Button>
                          Update
                        </Button>
                        <Button>
                          Delete
                        </Button>
                      </Grid>
                    </Grid>
                    </React.Fragment>
                  )
              })}
            </DialogContentText>
          </DialogContent>
          <DialogActions id='reviewButtons'>
            <Button onClick={this.handleBack} id='reviewBack'>
              <strong>Back</strong>
            </Button>
            {/* Link to review create modal & maybe add button for add to wtp or library */}
            <Button  id='addReview'> 
              <ReviewCreate token={this.props.token} results={this.state.results} />
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default ReviewsByGame;
