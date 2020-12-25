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
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">Subscribe</DialogTitle>
          <DialogContent dividers={this.state.scroll === "paper"}>
            <DialogContentText
              id="scroll-dialog-description"
            //   ref={descriptionElementRef}
              tabIndex={-1}
            >
              {this.state.reviews.map((review: any) => {
                  return (
                    <React.Fragment key={review.id}>
                    <Typography variant="h6" id="reviewTitle"><strong>{review.title}</strong></Typography>
                    <Typography id="entryText">{review.user.username}</Typography>
                    <Typography id="entryText">{review.entry}</Typography>
                    <Typography id="entryText">{new Date(review.createdAt).toLocaleDateString()}</Typography>
                    <Box component="fieldset" mb={3} borderColor="transparent" id="ratingReadOnly">
                      <Rating name="read-only" value={review.rating} readOnly />
                    </Box>
                    <hr/>
                    </React.Fragment>
                  )
              })}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleBack} color="primary">
              Back
            </Button>
            {/* Link to review create modal & maybe add button for add to wtp or library */}
            <Button onClick={this.handleClose} color="primary"> 
              Add Review 
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default ReviewsByGame;
