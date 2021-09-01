import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { alpha, makeStyles } from '@material-ui/core/styles';
import { GitHub, Home, Search } from '@material-ui/icons';

import TempDrawer from './TempDrawer';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
}));

export default function SearchAppBar(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar>
                <Toolbar>
                    
                    <IconButton
                        color="inherit"
                        href='https://georgefane.github.io/'
                    >
                        <Home />
                    </IconButton>

                    <Typography variant="h6" className={classes.title}>
                        Payoff Matrix Solver
                    </Typography>

                    <Typography variant="body1" className={classes.title}>
                        Solve economic games with any number of players and strategies
                    </Typography>

                    <TempDrawer />

                    <IconButton
                        color="inherit"
                        href='https://github.com/GeorgeFane/PayoffMatrixSolver'
                        target='_blank'
                    >
                        <GitHub />
                    </IconButton>

                </Toolbar>
            </AppBar>
        </div>
    );
}
