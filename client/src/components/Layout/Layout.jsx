import React from 'react'
import { Container, Grid, Box } from '@mui/material'
import Sidebar from '@/components/Sidebar'
import SearchBar from '@/components/SearchBar'
export const Layout = ({ children, sidebar }) => {
    return (
        <Container>
            <SearchBar />
            <Grid container spacing={3} py={4}>
                <Grid item xs={12} md={3}>
                    <Box bgcolor="white" boxShadow={1}>
                        {/*サイドバー */}
                        {sidebar}
                    </Box>
                </Grid>

                <Grid item xs={12} md={9}>
                    {children}
                </Grid>
            </Grid>
        </Container>
    )
}

export default Layout
