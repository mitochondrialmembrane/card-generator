import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


interface KeyProps {
    onSave: (updatedKey: string) => void;
}

export const KeyInput: React.FC<KeyProps> = ({ onSave }) => {
    const [open, setOpen] = React.useState(true);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            {/*<Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button>*/}
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries((formData as any).entries());
                        const key = formJson.key;
                        onSave(key);
                        handleClose();
                    },
                }}
            >
                <DialogTitle>Add your API Key</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To generate Anki cards, please enter your <a href="https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key" target="_blank" rel="noopener noreferrer">API key</a> (this will not be saved in any way).
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="key"
                        name="key"
                        label="API Key"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Confirm</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
