import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Box,
  Typography,
  Stack,
  Checkbox,
  Divider,
} from "@mui/material";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import VideoUtil from "../../../util/io_utils/VideoUtil";
import { useNotification } from "../../../Providers/NotificationProvider";

// Progress bar with label component
function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress 
          variant="determinate" 
          {...props} 
          sx={{ height: 10, borderRadius: 5 }}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

export default function DownloadManager() {
  // State management
  const [open, setOpen] = useState(false);
  const [tmpGid, setTmpGid] = useState("");
  const [tmpSource, setTmpSource] = useState("");
  const [input, setInput] = useState("");
  const [selectOpen, setSelectOpen] = useState(false);
  const [selections, setSelections] = useState([]);
  const [sources, setSources] = useState([
    { videoId: "videoId", source: "xxxx1", status: "init" },
    { videoId: "videoId", source: "xxxx2", status: "downloading" },
    { videoId: "videoId", source: "xxxx3", status: "paused" },
    { videoId: "videoId", source: "xxxx4", status: "cancelled" },
  ]);
  const [checkedNumber, setCheckedNumber] = useState(null);
  const [details, setDetails] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [file, setFile] = useState(null);
  const [movieName, setMovieName] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  // Handler functions
  const handleSelection = (idx) => () => {
    setCheckedNumber(checkedNumber !== idx ? idx : null);
  };

  const select = () => {
    if (!tmpGid || checkedNumber === null || !tmpSource) {
      setSelectOpen(false);
      return;
    }
    setVideoId(details.movieId);
    setMovieName(details.movie_name);
    VideoUtil.select(
      details.movieId,
      tmpSource,
      tmpGid,
      checkedNumber + 1,
      setSelectOpen
    );
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    if (!input || input.length === 0) {
      return;
    }
    VideoUtil.add_download_source(
      videoId,
      input,
      details.movie_name,
      sources,
      setSources
    );
    setInput("");
  };

  const handleDelete = (source) => () => {
    VideoUtil.remove_download_source("videoId", source, sources, setSources);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      showNotification("Please select a file first", "warning");
      return;
    }
    VideoUtil.uploadVideos(videoId, file, setUploadProgress, null);
  };

  const handlePlay = (resource) => () => {
    navigate("/longvideos", { state: { videoId: videoId, resource: resource } });
  };

  const handleDownload = (source) => () => {
    VideoUtil.start_download(
      videoId,
      source,
      details.movie_name,
      sources,
      setSources,
      setOpen,
      setSelections,
      setSelectOpen,
      setTmpGid
    );
    setTmpSource(source);
  };

  const handleOpenDetails = (row) => {
    setOpen(true);
    setDetails(row);
    setVideoId(row.movieId);
    setMovieName(row.movieName);
  };

  // Load data on component mount
  useEffect(() => {
    console.log("Download Requests Manager");
    VideoUtil.getRequests()
      .then((res) => {
        if (res.data.code !== 0) {
          showNotification("Network Error", "error");
          return;
        }
        if (res.data.code === 0) {
          let requests = JSON.parse(res.data.message);
          setSources(requests);
        }
      })
      .catch(err => {
        showNotification("Failed to load requests", "error");
      });
  }, []);

  // Get status color based on status
  const getStatusColor = (status) => {
    switch(status) {
      case "finished": return "success.main";
      case "downloading": return "info.main";
      case "paused": return "warning.main";
      case "cancelled": return "error.main";
      default: return "text.secondary";
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Download Manager
      </Typography>
      
      {/* Movie list table */}
      <TableContainer 
        component={Paper} 
        elevation={3} 
        sx={{ mb: 4, borderRadius: 2, overflow: "hidden" }}
      >
        <Table aria-label="movie downloads table">
          <TableHead sx={{ backgroundColor: "primary.main" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Movie ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Movie Name</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actors</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Year</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Advisor</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Submitted</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sources == null ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No data available</TableCell>
              </TableRow>
            ) : (
              sources.map((row, index) => (
                <TableRow
                  key={row.movieId || index}
                  sx={{ 
                    "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
                    "&:hover": { backgroundColor: "action.selected" },
                    transition: "background-color 0.2s"
                  }}
                >
                  <TableCell>{row.movieId}</TableCell>
                  <TableCell>{row.movieName}</TableCell>
                  <TableCell>{row.actorList}</TableCell>
                  <TableCell>{row.release_year}</TableCell>
                  <TableCell>{row.userId}</TableCell>
                  <TableCell>{row.timestamp}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleOpenDetails(row)}
                      sx={{ borderRadius: 2 }}
                    >
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Sources dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          {details?.movieName ? `Sources for ${details.movieName}` : "Sources"}
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText sx={{ mb: 2 }}>
            Manage download sources for this movie. Add, delete, or start downloads.
          </DialogContentText>
          
          <List sx={{ width: "100%" }}>
            {sources.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <Stack 
                    direction="row" 
                    spacing={2} 
                    sx={{ 
                      width: "100%", 
                      alignItems: "center",
                      bgcolor: index % 2 === 0 ? "action.hover" : "transparent",
                      borderRadius: 1,
                      padding: 1
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: "50%", 
                        bgcolor: getStatusColor(item.status),
                        boxShadow: 1
                      }} 
                    />
                    <ListItemText
                      primary={item.source}
                      secondary={`Status: ${item.status || "Unknown"}`}
                      sx={{ flexGrow: 1 }}
                    />
                    <Stack direction="row" spacing={1}>
                      <Button 
                        variant="outlined" 
                        color="error" 
                        size="small"
                        onClick={handleDelete(item.source)}
                        sx={{ minWidth: 0, borderRadius: 2 }}
                      >
                        Delete
                      </Button>
                      
                      {item.status && item.status === "finished" ? (
                        <Button 
                          variant="contained" 
                          color="success" 
                          size="small"
                          onClick={handlePlay(item.source)}
                          sx={{ minWidth: 0, borderRadius: 2 }}
                        >
                          Play
                        </Button>
                      ) : null}
                      
                      {item.status && item.status !== "finished" ? (
                        <Button 
                          variant="contained" 
                          color="primary" 
                          size="small"
                          onClick={handleDownload(item.source)}
                          sx={{ minWidth: 0, borderRadius: 2 }}
                        >
                          Download
                        </Button>
                      ) : null}
                    </Stack>
                  </Stack>
                </ListItem>
                {index < sources.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
            
            <Box sx={{ mt: 3, p: 2, bgcolor: "background.paper", borderRadius: 2, boxShadow: 1 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>Add New Source</Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Source URL"
                  variant="outlined"
                  size="small"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button 
                  variant="contained" 
                  onClick={handleSubmit}
                  sx={{ borderRadius: 2 }}
                >
                  Add
                </Button>
              </Stack>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" sx={{ mb: 2 }}>Upload Video File</Typography>
              <Stack direction="column" spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{ mr: 2, borderRadius: 2 }}
                  >
                    Choose File
                    <input
                      type="file"
                      hidden
                      onChange={handleFileChange}
                    />
                  </Button>
                  <Typography variant="body2">
                    {file ? file.name : "No file selected"}
                  </Typography>
                </Box>
                
                <Box sx={{ width: "100%" }}>
                  <LinearProgressWithLabel value={uploadProgress} />
                </Box>
                
                <Button 
                  variant="contained" 
                  color="secondary" 
                  onClick={handleUpload}
                  disabled={!file}
                  sx={{ alignSelf: "flex-start", borderRadius: 2 }}
                >
                  Upload
                </Button>
              </Stack>
            </Box>
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} variant="contained" sx={{ borderRadius: 2 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* File selection dialog */}
      <Dialog open={selectOpen} onClose={select} fullWidth maxWidth="md">
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          Select File to Download
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText sx={{ mb: 2 }}>
            You are using a P2P resource. Please select exactly one file you want to download.
          </DialogContentText>
          <List sx={{ width: "100%" }}>
            {selections.map((item, idx) => (
              <ListItem 
                key={idx}
                sx={{ 
                  borderRadius: 1,
                  bgcolor: checkedNumber === idx ? "action.selected" : idx % 2 === 0 ? "action.hover" : "transparent",
                }}
              >
                <Stack direction="row" spacing={2} sx={{ width: "100%", alignItems: "center" }}>
                  <Checkbox 
                    checked={checkedNumber === idx} 
                    onChange={handleSelection(idx)}
                    color="primary"
                  />
                  <ListItemText
                    primary={item.path}
                    secondary={`${(item.size / 1000000).toFixed(2)} MB`}
                  />
                </Stack>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={select} 
            variant="contained"
            disabled={checkedNumber === null}
            sx={{ borderRadius: 2 }}
          >
            Confirm Selection
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}