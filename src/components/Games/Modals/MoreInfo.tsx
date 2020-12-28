import React, {Component} from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import './MoreInfo.css';
import ReviewsByGame from '../../Reviews/ReviewsByGame';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
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
  token: string | null,
}

interface State {
    open: boolean;
    results: any
}

class MoreInfo extends Component<Props, State> {
    constructor(props: Props){
        super(props)
        this.state=({
            open: false,
            results: this.props.results
        })
    }

    handleClickOpen = () => {
        this.setState({
            open: true
        })
    }

    handleClose = () => {
        this.setState({
            open: false,
        })
    }

    render(){
        return(
            <div>
                <Button onClick={this.handleClickOpen}>
                    More Info
                    </Button>
                    <Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={this.state.open}>
                        <DialogTitle id="customized-dialog-title">
                            {this.state.results.name}
                        </DialogTitle>
                            <Grid id='infoBar'>
                                <Typography gutterBottom>
                                    <strong>Rating:</strong>{' '} {this.state.results.esrb_rating.name}
                                </Typography>
                                <Typography gutterBottom>
                                    <strong>Genre:</strong>{' '} {this.state.results.genres[1].name}
                                </Typography>
                                <Typography gutterBottom>
                                    <strong>Release:</strong>{' '} {new Date(this.state.results.released).toLocaleDateString()}
                                </Typography>
                            </Grid>
                        <DialogContent dividers>
                        <Typography gutterBottom>
                            {this.state.results.description.replace(/<\/?p[^>]*>/g, "")}
                        </Typography>
                        </DialogContent>
                        <DialogActions id='moreInfoButtons'>
                        <Button id='reviewsB'>
                            <ReviewsByGame token={this.props.token}results={this.state.results}/> 
                        </Button>
                        <Button onClick={this.handleClose} id='wtpB'>
                            Add To Want To Play
                        </Button>
                        <Button onClick={this.handleClose} id='libraryB'>
                            Add To Library
                        </Button>
                        </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default withStyles(styles)(MoreInfo);