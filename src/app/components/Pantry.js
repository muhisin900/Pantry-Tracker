import { useState, useEffect } from "react";
import { db, collection, doc, deleteDoc, onSnapshot} from "/firebase";
import {
  Button,
  Container,
  Paper,
  CardContent,
  CardMedia,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  ThemeProvider,
} from "@mui/material";
import AddItem from "./add";

const Pantry = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  //const [category, setCategory] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    itemId: null,
  });

  useEffect(() => {
    const itemsCollection = collection(db, "Inventory");
    const unsubscribe = onSnapshot(itemsCollection, (snapshot) => {
      const itemList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(itemList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = (id) => {
    setConfirmDelete({
      open: true,
      itemId: id,
    });
  };

  const confirmDeleteItem = async () => {
    try {
      if (!confirmDelete.itemId) {
        throw new Error('No itemId found in confirmDelete state.');
      }
  
      const itemDoc = doc(db, "Inventory", confirmDelete.itemId);
      await deleteDoc(itemDoc);
      
      setNotification({
        open: true,
        message: "Item deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting item: ", error);
      setNotification({
        open: true,
        message: "Error deleting item",
        severity: "error",
      });
    } finally {
      setConfirmDelete({
        open: false,
        itemId: null,
      });
    }
  };



  const calculateDaysFromDate = (date) => {
    const today = new Date();
    const itemDate = new Date(date);
    const timeDiff = today - itemDate;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff;
  };

  const filteredItems = items
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
      <Container sx={{ py: 4 }}>
        <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            sx={{
              backgroundColor: "#fff",
              borderRadius: 1,
              boxShadow: 2,
              "& .MuiInputBase-input": {
                padding: "12px",
              },
              "& .MuiFormLabel-root": {
                color: "#333",
              },
              "&:hover": {
                boxShadow: 4,
              },
            }}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setEditItem(null);
            setShowAdd(true);
          }}
          sx={{ mb: 3 }}
        >
          Add New Item
        </Button>
        {loading ? (
          <CircularProgress />
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            {filteredItems.map((item) => (
              <Paper
                elevation={8}
                key={item.id}
                sx={{
                  width: { xs: "100%", sm: "48%", md: "22%" },
                  p: 2,
                  boxShadow: 3,
                  borderRadius: 2,
                  boxSizing: "border-box",
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: 6,
                  },
                }}
              >
                {item.image && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.image}
                    alt={item.name}
                    sx={{ borderRadius: 1 }}
                  />
                )}
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "#00b4d8", fontWeight: "bold" }}
                  >
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="red">
                    Quantity: {item.quantity} {item.unit}
                  </Typography>
                  <Typography variant="body2" color="red">
                    Description: {item.description}
                  </Typography>
                  {item.date && (
                    <>
                      <Typography variant="body2" color="red">
                        Date: {new Date(item.date).toLocaleDateString()}
                      </Typography>
                      
                    </>
                  )}
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      onClick={() => {
                        setEditItem(item);
                        setShowAdd(true);
                      }}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(item.id)} color="error">
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Paper>
            ))}
          </Box>
        )}
        <Dialog open={showAdd} onClose={() => setShowAdd(false)}>
          <DialogContent>
            <AddItem
              item={editItem}
              onSave={() => setShowAdd(false)}
            />
          </DialogContent>
        </Dialog>
        <Dialog
          open={confirmDelete.open}
          onClose={() => setConfirmDelete({ open: false, itemId: null })}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this item?</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setConfirmDelete({ open: false, itemId: null })}
              color="blue"
            >
              Cancel
            </Button>
            <Button onClick={confirmDeleteItem} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
  );
};

export default Pantry;
