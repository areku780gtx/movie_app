import React from 'react'
import AppLayout from '../components/Layout/AppLayout'
import Head from 'next/head'
import laravelAxios from '@/lib/laravelAxios'
import useSWR from 'swr'
import MediaCard from '@/components/MediaCard'
import { Container, Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
const Favorites = () => {
    const fetcher = url => laravelAxios.get(url).then(res => res.data)
    const { data: favoriteItems, error } = useSWR('api/favorites', fetcher)

    console.log(favoriteItems)
    const loading = !favoriteItems && !error

    if (error) return <div>エラーが発生しました</div>

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    お気に入り
                </h2>
            }>
            <Head>
                <title>Laravel - Home</title>
            </Head>

            <Container>
                {loading ? (
                    <Grid item textAlign={'center'} xs={12}>
                        <Typography variant="h6">loading...</Typography>
                    </Grid>
                ) : favoriteItems?.length > 0 ? (
                    <Grid container spacing={3} py={3}>
                        {favoriteItems?.map(item => (
                            <MediaCard
                                item={item}
                                key={item.id}
                                isContent={false}
                            />
                        ))}
                    </Grid>
                ) : (
                    <Grid item textAlign={'center'} xs={12}>
                        <Typography>
                            お気に入りのアイテムはありません
                        </Typography>
                    </Grid>
                )}
            </Container>
        </AppLayout>
    )
}

export default Favorites
