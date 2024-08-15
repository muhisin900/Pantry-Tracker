import React, { useState, useEffect } from 'react';
import {TextField, Button, Container, FormControl, InputLabel, Select, MenuItem, Box, Typography, Paper, ThemeProvider,} from "@mui/material";
import { db, storage, doc, setDoc, ref, uploadBytes, getDownloadURL } from '/firebase';

const AddItem = ({ item, onItemAdded }) => {
    const [name, setName] = useState(item ? item.name : "");
    const [quantity, setQuantity] = useState(item ? item.quantity : "");
    const [unit, setUnit] = useState(item ? item.unit : "");
    const [description, setDescription] = useState(item ? item.description : "");
    const [image, setImage] = useState(item ? item.image : "");
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (item) {
          setName(item.name);
          setQuantity(item.quantity);
          setDescription(item.description);
          setUnit(item.unit);
          setImage(item.image);
        }
      }, [item]);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
          setImageFile(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
          let imageUrl = "";
    
          if (imageFile) {
            const imageRef = ref(
              storage,
              `Inventory/${new Date().toISOString()}_${imageFile.name}`
            );
            await uploadBytes(imageRef, imageFile);
            imageUrl = await getDownloadURL(imageRef);
          }
    
          const itemRef = doc(
            db,
            "Inventory",
            item ? item.id : new Date().toISOString()
          );
          await setDoc(itemRef, {
            name,
            quantity,
            unit,
            description,
            image: imageUrl || image,
          });
    
          onItemAdded();
        } catch (error) {
          console.error("Error saving item: ", error);
        } finally {
          setLoading(false);
        }
      };

    return(
      <Container
        component={Paper}
        elevation={3}
        sx={{
          p: 3,
          maxWidth: 600,
          mx: "auto",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          color: "#000",
          minHeight: "400px", 
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ color: "blue" }}>
          {item ? "Edit Item" : "Add New Item"}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="dense"
            variant="outlined"
            sx={{mb:2}}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              margin="dense"
              variant="outlined"
              sx={{ width: 300, mb: 1 }}
            />
            <FormControl sx={{ width: 100 }}>
              <InputLabel>Unit</InputLabel>
              <Select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                label="Unit"
              >
                <MenuItem value="amount">amount</MenuItem>
                <MenuItem value="lbs">lbs</MenuItem>
                <MenuItem value="kg">kg</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="dense"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Box sx={{ mt: 2 }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginBottom: "16px" }}
            />
            {image || imageFile ? (
              <img
                src={image || URL.createObjectURL(imageFile)}
                alt="Item"
                style={{ width: "100%", height: "auto", borderRadius: "4px" }}
              />
            ) : null}
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
          <Button onClick={onItemAdded} variant="outlined">
            Cancel
          </Button>
        </Box>
      </Container>
    )
}
export default AddItem;