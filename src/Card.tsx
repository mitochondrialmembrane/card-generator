import React, { useState, useRef } from 'react';
import './Card.css';
import * as Constants from './constants';
import { Box, IconButton, Menu, MenuItem, TextField } from '@mui/material';
import { MoreVert } from '@mui/icons-material';

interface CardProps {
  initialContent: string;
  onChange: (updatedContent: string) => void;
  onDelete: () => void;
}

export const Card: React.FC<CardProps> = ({ initialContent, onChange, onDelete }) => {
  const getHighestClozeNumber = (text: string): number => {
    // Regular expression to match all cloze numbers like {{c1::...}}, {{c2::...}}, etc.
    const clozeRegex = /{{c(\d+)::/g;
    let match;
    let highest = 0;

    // Use the regular expression to find all matches in the string
    while ((match = clozeRegex.exec(text)) !== null) {
      // The first capturing group is the cloze number (e.g., "1" from {{c1::...}})
      const clozeNumber = parseInt(match[1], 10);
      highest = Math.max(highest, clozeNumber);
    }

    return highest;
  };

  const [content, setContent] = useState<string>(initialContent);
  const [highestClozeNumber, setHighestClozeNumber] = useState<number>(getHighestClozeNumber(initialContent));
  const divRef = useRef<HTMLDivElement>(null); // Ref to the textarea

  // Handle content change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedContent = e.target.value;
    setContent(updatedContent);
    onChange(updatedContent); // Call the onChange prop with the updated content
  };

  const wrapWithCloze = (num: number) => {
    const selection = window.getSelection();
    if (selection && divRef.current) {
      const range = selection.getRangeAt(0);

      // Check if the selection is within the div
      if (divRef.current.contains(range.commonAncestorContainer)) {
        const clozeText = `{{c${num}::${selection}}}`;
        range.deleteContents();
        range.insertNode(document.createTextNode(clozeText));

        // Update the state with the new content of the div
        setContent(divRef.current.innerHTML);
      }
    }
  };

  const addNewCloze = () => {
    wrapWithCloze(highestClozeNumber + 1);
    setHighestClozeNumber(prevHighestClozeNumber => prevHighestClozeNumber + 1);
    handleClose();
  }

  const addSameCloze = () => {
    wrapWithCloze(highestClozeNumber);
    handleClose();
  }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{
      position: "relative",
      minHeight: '100px',
      maxWidth: '320px',
      width: '100%'
    }}>
      <TextField
        ref={divRef}
        defaultValue={content}
        label="Multiline"
        multiline
        maxRows={4}
      />
      <Box>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
          sx={{
            position: "absolute", // Positioning the button relative to the parent container
            top: "25%", // Adjusts vertical position
            left: "100%", // Adjusts horizontal position (relative to the TextField)
            transform: "translateY(-50%)", // Vertically centers the button
          }}
        >
          <MoreVert />
        </IconButton>
        <Menu
          id="long-menu"
          MenuListProps={{
            'aria-labelledby': 'long-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={addNewCloze}>Add New Cloze</MenuItem>
          <MenuItem onClick={addSameCloze}>Add Same Cloze</MenuItem>
          <MenuItem onClick={onDelete}>Delete Card</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};