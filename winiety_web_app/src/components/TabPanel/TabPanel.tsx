import { Box, Paper } from '@material-ui/core';
import React, { ReactElement } from 'react';
import useStyles from './use-styles';

interface TabPanelProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  children?: React.ReactNode;
  dir?: string;
  style?: React.CSSProperties;
  index: number;
}

const TabPanel = (props: TabPanelProps): ReactElement => {
  const { children, index, style, ...other } = props;
  const classes = useStyles();
  return (
    <div
      role="tabpanel"
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    >
      <Box
        p={3}
        display="flex"
        flexDirection="column"
        alignItems="center"
        height="100%"
      >
        <Paper style={style} className={classes.paper}>
          {children}
        </Paper>
      </Box>
    </div>
  );
};

export default TabPanel;
