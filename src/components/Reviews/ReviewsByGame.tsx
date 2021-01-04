import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Rating from "@material-ui/lab/Rating";
import './ReviewsByGame.css';

interface Props {
    results: any,
}

interface State {
    open: boolean;
    scroll: DialogProps["scroll"];
    myRef: any;
    results: any,
    reviews: any,
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
          <DialogTitle id="reviewHead"><strong>Reviews</strong></DialogTitle>
          <DialogContent dividers={this.state.scroll === "paper"}>
            <DialogContentText
              id="dialogBody"
            //   ref={descriptionElementRef}
              tabIndex={-1}
            >
              {this.state.reviews.map((review: any) => {
                  return (
                    <React.Fragment key={review.id}>
                    <Box component="fieldset" mb={3} borderColor="transparent" id="titleBox">
                      <Typography id="reviewTitle"><strong>{review.title}</strong></Typography>
                    </Box>
                    <Box component="fieldset" mb={3} borderColor="transparent" id="usernameBox">
                      <Typography id="entryText">{review.user.username}</Typography>
                    </Box>
                    <Box component="fieldset" mb={3} borderColor="transparent" id="entryBox"> 
                      <Typography id="entryText">{review.entry}</Typography>
                    </Box>
                    <Box component="fieldset" mb={3} borderColor="transparent" id="dateBox"> 
                      <Typography id="entryText">{new Date(review.createdAt).toLocaleDateString()}</Typography>
                    </Box>
                    <Box component="fieldset" mb={3} borderColor="transparent" id="ratingReadOnly">
                      <Rating name="read-only" value={review.rating} readOnly />
                    </Box>
                    </React.Fragment>
                  )
              })}
            </DialogContentText>
          </DialogContent>
          <DialogActions id='reviewButtons'>
            <Button onClick={this.handleBack} id='reviewBack'>
              Back
            </Button>
            {/* Link to review create modal & maybe add button for add to wtp or library */}
            <Button onClick={this.handleClose} id='addReview'> 
              Add Review 
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default ReviewsByGame;
