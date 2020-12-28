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
    username: string,
    password: string,
    open: boolean,
}


class LoginPopUp extends Component<Props, State> {
    constructor(props: any){
        super(props)
        this.state=({
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
        fetch('http://localhost:4321/user/login', {
            method: 'POST',
            body: JSON.stringify({username: this.state.username, password: this.state.password}),
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
                <Button onClick={this.handleClickOpen} id='loginBut'>
                   <strong>Login</strong>
                </Button>
                <Dialog open={this.state.open} onClose={this.handleClose}>
                    <DialogTitle id="form-dialog-title">Login</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin='dense'
                            label='username'
                            type='text'
                            fullWidth
                            onChange={(e) => this.setState({username: e.target.value})}
                        />
                        <TextField
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
                        Login
                    </Button>
                </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default LoginPopUp;