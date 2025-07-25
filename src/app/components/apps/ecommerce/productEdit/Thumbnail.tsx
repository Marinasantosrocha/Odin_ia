"use client";
import React, { useState, useRef } from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import Image from 'next/image'

const Thumbnail = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(
    "/images/blog/blog-img1.jpg"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Open file input dialog on image click
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Validate file size and type (optional)
    if (file.size > 1024 * 1024 * 5) {
      alert("File size is too large! Max 5MB allowed.");
      return;
    }

    // Read and display image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Set the image file for upload
    setImageFile(file);
  };

  return (
    <Box p={3}>
      <Typography variant="h5">Thumbnail</Typography>
      <Box mt={3} mb={2} textAlign="center">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {imageUrl ? (
          <Box>
            <Image
              src={imageUrl}
              alt="Preview"
              onClick={handleImageClick}
              style={{
                maxWidth: "300px",
                borderRadius: "7px",
                margin: "0 auto",
              }}
              width={300}
              height={300}
            />
          </Box>
        ) : null}

        <Typography variant="body2" textAlign="center">
          Click on image to change
        </Typography>
      </Box>
    </Box>
  );
};

export default Thumbnail;
