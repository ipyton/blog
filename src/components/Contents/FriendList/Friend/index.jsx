import * as React from 'react';
import List from '@mui/material/List';

import Typography from '@mui/material/Typography';
import FriendItem from './FriendItem';
import { Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import SwipeableViews from 'react-swipeable-views';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';

import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SocialMediaUtil from '../../../../util/io_utils/SocialMediaUtil';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}


export default function (props) {
    const theme = useTheme();

    const [value, setValue] = React.useState(0)
    const [list, setList] = React.useState([])
    const {setSelector} = props

    React.useEffect(()=>{
        SocialMediaUtil.getRelationships(value, setValue, setList)
    
    },[])
    const handleChange = (event, newValue) => {
        SocialMediaUtil.getRelationships(newValue, setValue, setList)
    };
    const handleChangeIndex = (index) => {
        setValue(index);
    };
    return (<Stack sx={{ width: "30%", boxShadow: 1, borderRadius: 2 }} spacing={2}>
        <Box sx={{ bgcolor: 'background.paper' }}>
            <AppBar position="static">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="secondary"
                    textColor="inherit"
                    aria-label="full width tabs example"
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label="Friends" {...a11yProps(0)} />
                    <Tab label="Follows" {...a11yProps(1)} />
                    <Tab label="Followers" {...a11yProps(2)} />
                    <Tab label="Groups" {...a11yProps(3)} />
                    <Tab label="Invitations" {...a11yProps(4)} />
                    <Tab label="BlackList" {...a11yProps(5)} />
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <List>
                        {list.map((res, idx) => {
                            return (<FriendItem setSelector={setSelector} content={res} idx={0}></FriendItem>)
                        })}
                    </List>

                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <List>
                        {list.map((res, idx) => {
                            return (<FriendItem setSelector={setSelector} content={res} idx={1}></FriendItem>)
                        })}

                    </List>

                </TabPanel>
                <TabPanel value={value} index={2} dir={theme.direction}>
                    <List>
                        {list.map((res, idx) => {
                            return (<FriendItem setSelector={setSelector} content={res} idx={2}></FriendItem>)
                        })}

                    </List>

                </TabPanel>
                <TabPanel value={value} index={3} dir={theme.direction}>
                    <List>
                        {list.map((res, idx) => {
                            return (<FriendItem setSelector={setSelector} content={res} idx={3}></FriendItem>)
                        })}

                    </List>

                </TabPanel>
                <TabPanel value={value} index={4} dir={theme.direction}>
                    <List>
                        {list.map((res, idx) => {
                            return (<FriendItem setSelector={setSelector} content={res} idx={4}></FriendItem>)
                        })}

                    </List>

                </TabPanel>
                <TabPanel value={value} index={5} dir={theme.direction}>
                    <List>
                        {list.map((res, idx) => {
                            return (<FriendItem setSelector={setSelector} content={res} idx={5}></FriendItem>)
                        })}

                    </List>

                </TabPanel>
            </SwipeableViews>
        </Box>


    </Stack>)
}