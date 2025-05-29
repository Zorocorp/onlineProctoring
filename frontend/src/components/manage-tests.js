import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Button,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  CircularProgress,
  Modal,
} from "@mui/material";
import { MoreVert, Edit,ContentCopy, Delete, Menu as MenuIcon } from "@mui/icons-material";
import logo from "../assets/Image20250320122406.png";
import { useNavigate } from "react-router-dom";
import Navigation from './AdminNavbar';
const API_BASE_URL = "http://127.0.0.1:8000"; // Base URL

const ManageTestsPage = () => {
  const navigate = useNavigate(); // Get the navigate function
  const [tests, setTests] = useState([]);
  const [testLink, setTestLink] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Function to get the token from localStorage
  const token = () => {
    return localStorage.getItem("user_token");
  };

  // Fetch tests with the correct token
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/tests/`, {
          headers: { Authorization: `Token ${token()}` },
        });
        setTests(response.data);
      } catch (error) {
        console.error("Error fetching tests:", error);
        setSnackbarMessage("Failed to fetch tests.");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  const handleMenuOpen = (event, test) => {
    setMenuAnchor(event.currentTarget);
    setSelectedTest(test);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };
  const handleDuplicateTest = async () => {
    try {
      const userToken = localStorage.getItem("user_token"); // Assuming userToken is stored in localStorage
  
      const response = await axios.post(
        `${API_BASE_URL}/api/tests/${selectedTest.id}/duplicate/`,
        {},
        {
          headers: {
            Authorization: `Token ${userToken}`,
          },
        }
      );
  
      if (response.data.test_link) {
        setTestLink(response.data.test_link);
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Failed to duplicate test", error);
    }
  };
    
  const handleEditTest = () => {
    if (selectedTest && selectedTest.id) {  // Ensure selectedTest and its ID exist
      navigate(`/edit-test/${selectedTest.id}`); // Navigate to edit page with test ID
      handleMenuClose();
    } else {
      console.error("No test selected or test ID is missing");
    }
  };
  

  // Function to delete a test
  const handleDeleteTest = async () => {
    if (selectedTest) {
      try {
        await axios.delete(`${API_BASE_URL}/api/tests/${selectedTest.id}/`, {
          headers: { Authorization: `Token ${token()}` },
        });
        setTests(tests.filter((test) => test.id !== selectedTest.id));
        setSnackbarMessage("Test deleted successfully!");
      } catch (error) {
        setSnackbarMessage("Failed to delete test.");
      }
      setSnackbarOpen(true);
      handleMenuClose();
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
    <Navigation/>
    <Box sx={{ display: "flex" }}>
      

      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 10 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Test Management Hub
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
<TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
  <Table>
    <TableHead>
      <TableRow sx={{ backgroundColor: "#003366" }}>
        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Serial No</TableCell>
        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Test No</TableCell>
        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Test Name</TableCell>
        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Time Limit (Minutes)</TableCell>
        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Duration Date</TableCell>
        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Duration Time</TableCell>
        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Created At</TableCell>
        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {tests.map((test, index) => (
        <TableRow key={test.id} hover>
          <TableCell>{index + 1}</TableCell> {/* Serial Number */}
          <TableCell>{test.id}</TableCell>
          <TableCell>{test.title}</TableCell>
          <TableCell>{test.status || "Completed"}</TableCell>
          <TableCell>{test.total_time_limit}</TableCell>
          <TableCell>{test.start_date ? new Date(test.end_date).toLocaleDateString() : "N/A"}</TableCell>
          <TableCell>{test.due_time || "N/A"}</TableCell>
          <TableCell>{new Date(test.created_at).toLocaleString()}</TableCell>
          <TableCell>
            <Tooltip title="More Actions">
              <IconButton
                onClick={(e) => handleMenuOpen(e, test)}
                sx={{ color: "#003366" }}
              >
                <MoreVert />
              </IconButton>
            </Tooltip>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
        )}
<Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
  <MenuItem onClick={handleEditTest}>
    <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
  </MenuItem>

  <MenuItem onClick={handleDuplicateTest}>
    <ContentCopy fontSize="small" sx={{ mr: 1 }} /> Duplicate Test
  </MenuItem>

  <MenuItem onClick={handleDeleteTest}>
    <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
  </MenuItem>
</Menu>
<Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 600,  // Increased width for larger modal
      height: 400, // Optional: Set a height if you want to control the height of the modal
      bgcolor: "background.paper",
      boxShadow: 24,
      p: 6,  // Increased padding for a more spacious design
      borderRadius: 2,
    }}
  >
    <Typography variant="h6" sx={{ fontSize: 20 }}>Test Duplicated Successfully!</Typography>  {/* Adjusted font size */}
    <Typography sx={{ mt: 2, fontSize: 16 }}>
      Share this link: <strong style={{ color: "blue" }}>{testLink}</strong>
    </Typography>
    <Button
      onClick={() => navigator.clipboard.writeText(testLink)}
      startIcon={<ContentCopy />}
      variant="contained"
      sx={{ mt: 3 }}  // Increased margin top for spacing
    >
      Copy Link
    </Button>
  </Box>
</Modal>

        <br/>  <br/>  <br/>  <br/>
       
      </Box>
    </Box>
    </>
  );
};

export default ManageTestsPage;