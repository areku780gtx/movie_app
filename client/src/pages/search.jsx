import React from 'react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import AppLayout from '@/components/Layout/AppLayout'
import Head from 'next/head'
import Layout from '@/components/Layout/Layout'
import Sidebar from '@/components/Sidebar'
import MediaCard from '@/components/MediaCard'
import { Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import { Tune } from '@mui/icons-material'
const Search = () => {
    const [category, setCategory] = useState('all')
    const [results, setResults] = useState([])
    const router = useRouter()
    const { query: searchQuery } = router.query

    const [loading, setLoading] = useState(true)
    console.log(category)
    useEffect(() => {
        if (!searchQuery) return

        const fetchMedia = async () => {
            try {
                const response = await axios.get(
                    `/api/searchMedia?searchQuery=${searchQuery}`,
                )

                const searchResults = response.data.results

                const validResults = searchResults.filter(
                    item =>
                        item.media_type === 'movie' || item.media_type === 'tv',
                )
                setResults(validResults)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchMedia()
    }, [searchQuery])

    const filteredResults = results.filter(result => {
        if (category === 'all') return true
        return result.media_type === category
    })

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Search
                </h2>
            }>
            <Layout sidebar={<Sidebar setCategory={setCategory} />}>
                {loading ? (
                    <Grid item textAlign={'center'} xs={12}>
                        <Typography>Loading...</Typography>
                    </Grid>
                ) : filteredResults.length > 0 ? (
                    <Grid container spacing={3}>
                        {filteredResults.map(media => (
                            <MediaCard
                                item={media}
                                key={media.id}
                                isContent={true}
                            />
                        ))}
                    </Grid>
                ) : (
                    <Grid item textAlign={'center'} xs={12}>
                        <Typography>検索結果がありません</Typography>
                    </Grid>
                )}
            </Layout>
        </AppLayout>
    )
}

export default Search
