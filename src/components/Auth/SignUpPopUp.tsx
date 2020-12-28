import React, { Component } from 'react';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@material-ui/core';

interface Props {
    openSnackBar: (severity: 'success' | 'error', message: string) => void,
    updateToken: (newToken: string) => void,
}

interface State {
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string,
    open: boolean,
}


class SignUpPopUp extends Component<Props, State> {
    constructor(props: any){
        super(props)
        this.state=({
            firstName: "",
            lastName: "",
            email: "",
            username: "",
            password: "",
            open: false,
        })
    }

    handleClickOpen = () => {
        this.setState({
            open: true,
        })
    }

    handleClose = () => {
        this.setState({
            open: false,
        })
    }

    handleSubmit = (event: any) => {
        event.preventDefault();
        fetch('http://localhost:4321/user/register', {
            method: 'POST',
            body: JSON.stringify({firstName: this.state.firstName, lastName: this.state.lastName, email: this.state.email, username: this.state.username, password: this.state.password}),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
        .then((response) => response.json())
        .then((data) => {
            if (!data.sessionToken) {
                this.props.openSnackBar('error', data.message)
            } else {
            const message = data.message
            this.props.openSnackBar('success', message);
            this.props.updateToken(data.sessionToken);
            this.handleClose();
        }})
    }

    render(){
        return(
            <div>
                <Button onClick={this.handleClickOpen} id='signupBut'>
                    <strong>Sign Up</strong>
                </Button>
                <Dialog open={this.state.open} onClose={this.handleClose}>
                    <DialogTitle id="form-dialog-title">Sign Up</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin='dense'
                            label='First Name'
                            type='text'
                            fullWidth
                            onChange={(e) => this.setState({firstName: e.target.value})}
                        />
                        <TextField
                            autoFocus
                            margin='dense'
                            label='Last Name'
                            type='text'
                            fullWidth
                            onChange={(e) => this.setState({lastName: e.target.value})}
                        />
                        <TextField
                            autoFocus
                            margin='dense'
                            label='Email'
                            type='email'
                            fullWidth
                            onChange={(e) => this.setState({email: e.target.value})}
                        />
                        <TextField
                            autoFocus
                            margin='dense'
                            label='username'
                            type='text'
                            fullWidth
                            onChange={(e) => this.setState({username: e.target.value})}
                        />
                        <TextField
                            error={this.state.password.length > 0 && this.state.password.length < 6}
                            helperText={this.state.password.length > 0 && this.state.password.length < 6 ? 'Password must be 6 characters long' : null}
                            autoFocus
                            margin="dense"
                            label="Password"
                            type="password"
                            fullWidth
                            onChange={(e) => this.setState({password: e.target.value})}
                        />
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={this.handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={this.handleSubmit}>
                        Sign Up
                    </Button>
                </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default SignUpPopUp;