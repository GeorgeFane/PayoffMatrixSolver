

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { GitHub, Home } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default function ButtonAppBar() {
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
                        RatingsMap
                    </Typography>

                    <Typography variant="h6" className={classes.title}>
                        Generate heatmaps for TV show ratings
                    </Typography>

                    <IconButton
                        color="inherit"
                        href='https://github.com/GeorgeFane/ratingsmap'
                        target='_blank'
                    >
                        <GitHub />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </div>
    );
}
