import { List, ListItemText } from '@mui/material'
import React from 'react'
import { ListItemButton } from '@mui/material'
import { Typography } from '@mui/material'
const Sidebar = ({ setCategory }) => {
    return (
        <div>
            <Typography sx={{ bgcolor: 'blue', color: 'white', padding: 1 }}>
                カテゴリ
            </Typography>
            <List component="nav">
                <ListItemButton onClick={() => setCategory('all')}>
                    <ListItemText primary="全て"></ListItemText>
                </ListItemButton>
                <ListItemButton onClick={() => setCategory('movie')}>
                    <ListItemText primary="映画"></ListItemText>
                </ListItemButton>

                <ListItemButton onClick={() => setCategory('tv')}>
                    <ListItemText primary="TV"></ListItemText>
                </ListItemButton>
            </List>
        </div>
    )
}

export default Sidebar
