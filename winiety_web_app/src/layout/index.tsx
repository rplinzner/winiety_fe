import { makeStyles, Theme } from '@material-ui/core';
import React, { ReactElement, useRef } from 'react';
import AppBar from './AppBar';
import BottomNavigationComp from './BottomNavigation';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  stickToBottom: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    overflow: 'hidden',
  },
  offset: theme.mixins.toolbar,
}));

interface Props {
  children?: ReactElement;
}

export default (props: Props): ReactElement => {
  const { children } = props;
  const classes = useStyles();
  const bottomNavigationElement = useRef(
    document.getElementById('bottom__nav')
  );
  return (
    <div className={classes.root}>
      <AppBar />
      <div className={classes.offset} />
      <div
        style={{
          marginBottom: bottomNavigationElement.current?.clientHeight || 56,
        }}
        id="app__content"
        className="h-100 overflow-auto"
      >
        {children}
      </div>
      <BottomNavigationComp className={classes.stickToBottom} />
    </div>
  );
};