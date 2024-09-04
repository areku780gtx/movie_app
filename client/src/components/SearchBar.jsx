import { Box, TextField } from '@mui/material'
import React from 'react'
import { Button } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useState } from 'react'
import { useRouter } from 'next/router'
const SearchBar = () => {
    const [query, setQuery] = useState('')
    const router = useRouter()
    const handleChange = e => {
        setQuery(e.target.value)
    }

    const searchQuery = e => {
        e.preventDefault()
        if (!query.trim()) return
        // alert('test')
        router.push(`/search?query=${encodeURIComponent(query)}`)
    }

    return (
        <Box
            component={'form'}
            onSubmit={searchQuery}
            sx={{
                width: '80%',
                margin: '3% auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <TextField
                onChange={handleChange}
                fullWidth
                variant="filled"
                placeholder="検索する"
                sx={{ mr: 2, boxShadow: '0 4px 6px 0 rgba(0, 0, 0, 0.1)' }}
            />

            <Button type="submit">
                <SearchIcon />
            </Button>
        </Box>
    )
}

export default SearchBar
