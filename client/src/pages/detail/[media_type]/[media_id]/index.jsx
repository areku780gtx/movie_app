import React, { useEffect } from 'react'
import axios from 'axios'

import AppLayout from '@/components/Layout/AppLayout'
import Head from 'next/head'
import { useState } from 'react'
import Rating from '@mui/material/Rating'
import AddIcon from '@mui/icons-material/Add'
import Tooltip from '@mui/material/Tooltip'
import Fab from '@mui/material/Fab'
import Button from '@mui/material/Button'
import StarIcon from '@mui/icons-material/Star'
import FavoriteIcon from '@mui/icons-material/Favorite'
import IconButton from '@mui/material/IconButton'

import {
    Box,
    Grid,
    Container,
    Typography,
    Card,
    CardContent,
    Modal,
    TextareaAutosize,
    ButtonGroup,
} from '@mui/material'
import laravelAxios from '@/lib/laravelAxios'
import mitt from 'next/dist/shared/lib/mitt'
import { useAuth } from '@/hooks/auth'
import Link from 'next/link'

const Detail = ({ detail, media_type, media_id }) => {
    console.log(detail)
    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(1)
    const [review, setReview] = useState('')
    const [reviews, setReviews] = useState([])
    const [averageRating, setAverageRating] = useState(null)
    const [editMode, setEditMode] = useState(null)
    const [editedRating, setEditedRating] = useState(null)
    const [editedContent, setEditedContent] = useState('')
    const [isFavorite, setIsFavorite] = useState(false)

    const { user } = useAuth({ middleware: 'auth' })

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const handleConfirmEdit = async reviewId => {
        console.log(reviewId)
        try {
            const response = await laravelAxios.put(`/api/review/${reviewId}`, {
                content: editedContent,
                rating: editedRating,
            })
            console.log(response)
            const updatedReview = response.data
            const updatedReviews = reviews.map(review => {
                if (review.id === reviewId) {
                    return {
                        ...review,
                        rating: updatedReview.rating,
                        content: updatedReview.content,
                    }
                }
                return review
            })

            setReviews(updatedReviews)

            console.log(updatedReviews)

            setEditMode(null)
        } catch (error) {}
    }

    const handleDelete = async id => {
        console.log(id)
        if (confirm('本当に削除しますか？')) {
            try {
                const response = await laravelAxios.delete(`/api/review/${id}`)
                console.log(response)
                const filteredReviews = reviews.filter(
                    review => review.id !== id,
                )
                console.log(filteredReviews)
                setReviews(filteredReviews)
                updateAverageRating(filteredReviews)
            } catch (error) {
                console.log('レビュー削除エラー', error)
            }
        }
    }
    const handleEdit = review => {
        setEditMode(review.id)
        setEditedRating(review.rating)
        setEditedContent(review.content)
    }
    const handleToggleFavorite = async () => {
        console.log('お気に入りに登録')
        try {
            const response = await laravelAxios.post('/api/favorites/', {
                media_type: media_type,
                media_id: media_id,
            })
            console.log(response.data)
            console.log('お気に入りに登録成功')
            setIsFavorite(response.data.status === 'added')
        } catch (error) {
            console.log('お気に入りエラー', error)
        }
    }
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const [reviewResponse, favoriteResponse] = await Promise.all([
                    laravelAxios.get(`/api/reviews/${media_type}/${media_id}`),
                    laravelAxios.get(`/api/favorites/status`, {
                        params: { media_type: media_type, media_id: media_id },
                    }),
                ])

                const fetchReviews = reviewResponse.data

                setReviews(fetchReviews)
                updateAverageRating(fetchReviews)

                console.log(favoriteResponse)
            } catch (error) {
                console.log('レビュー取得エラー', error)
            }
        }
        fetchReviews()
    }, [media_type, media_id])

    const updateAverageRating = updateReviews => {
        if (updateReviews.length > 0) {
            const totalRating = updateReviews.reduce(
                (acc, review) => acc + review.rating,
                0,
            )
            const average = (totalRating / updateReviews.length).toFixed(1)
            setAverageRating(average)
        } else {
            setAverageRating(null)
        }
    }

    const handleReviewChange = e => {
        setReview(e.target.value)
        console.log(review)
    }
    const handleRatingChange = (e, newValue) => {
        // console.log(newValue)
        setRating(newValue)
        console.log(rating)
    }

    const isButtonDisabled = (rating, content) => {
        return !content.trim() || !rating
    }

    const isReviewButtonDisabled = isButtonDisabled(rating, review)
    const isEditButtonDisabled = isButtonDisabled(editedRating, editedContent)

    const handleReviewAdd = async () => {
        handleClose()
        try {
            const response = await laravelAxios.post('/api/reviews', {
                content: review,
                rating: rating,
                media_type: media_type,
                media_id: media_id,
            })
            // console.log(response.data)
            const newReviews = response.data

            setReviews([...reviews, newReviews])
            console.log(reviews)
            setReview('')
            setRating(0)
            const updatedReviews = [...reviews, newReviews]
            updateAverageRating(updatedReviews)
        } catch (error) {
            console.log('レビュー追加エラー', error)
        }
    }

    // const review = [
    //     {
    //         id: 1,
    //         content: 'これはテストです',
    //         rating: 5,
    //         user: {
    //             name: 'テストユーザー',
    //         },
    //     },
    //     {
    //         id: 2,
    //         content: '最悪',
    //         rating: 1,
    //         user: {
    //             name: 'テストユーザー2',
    //         },
    //     },
    //     {
    //         id: 2,
    //         content: '普通',
    //         rating: 3,
    //         user: {
    //             name: 'テストユーザー3',
    //         },
    //     },
    // ]

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Detail
                </h2>
            }>
            <Head>
                <title>Laravel - Detail</title>
            </Head>

            <Box
                sx={{
                    height: { xs: 'auto', md: '70vh' },
                    bgcolor: 'red',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <Box
                    sx={{
                        backgroundImage: `url(https://image.tmdb.org/t/p/original/${detail.backdrop_path})`,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',

                        '&:before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                        },
                    }}
                />
                <Container sx={{ zIndex: 1 }}>
                    <Grid
                        sx={{ color: 'white' }}
                        container
                        alignItems={'center'}>
                        <Grid
                            item
                            md={4}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}>
                            <img
                                width={'70%'}
                                src={`https://image.tmdb.org/t/p/original/${detail.poster_path}`}
                                alt=""
                            />
                        </Grid>
                        <Grid item md={8}>
                            <Typography variant="h4" paragraph>
                                {detail.title}
                            </Typography>
                            <Typography variant="h6" paragraph>
                                {detail.overview}
                            </Typography>

                            <IconButton
                                onClick={handleToggleFavorite}
                                style={{
                                    color: isFavorite ? 'red' : 'white',
                                    backgroundColor: 'black',
                                }}>
                                <FavoriteIcon />
                            </IconButton>

                            <Box
                                gap={2}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                }}>
                                <Rating
                                    readOnly
                                    precision={0.5}
                                    value={parseFloat(averageRating)}
                                    emptyIcon={
                                        <StarIcon style={{ color: 'white' }} />
                                    }
                                />
                                <Typography
                                    sx={{
                                        ml: 1,
                                        fontSize: '1.5em',
                                        fontWeight: 'bold',
                                    }}>
                                    {averageRating}
                                </Typography>
                            </Box>

                            <Typography variant="h6">
                                {media_type == 'movie'
                                    ? `公開日:${detail.release_date}`
                                    : `初回放送日:${detail.first_air_date}`}
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Container sx={{ py: 5 }}>
                <Typography
                    component={'h1'}
                    variant={'h4'}
                    align={'center'}
                    gutterBottom>
                    レビュー一覧
                </Typography>

                <Grid container spacing={2}>
                    {reviews.map(review => (
                        <Grid item xs={12} key={review.id}>
                            <Card>
                                <CardContent>
                                    <Typography
                                        variant={'h6'}
                                        component={'div'}
                                        gutterBottom>
                                        {review.user.name}
                                    </Typography>
                                    {editMode === review.id ? (
                                        <>
                                            <Rating
                                                value={editedRating}
                                                onChange={(e, newValue) =>
                                                    setEditedRating(newValue)
                                                }
                                            />
                                            <TextareaAutosize
                                                minRows={3}
                                                style={{ width: '100%' }}
                                                value={editedContent}
                                                onChange={e =>
                                                    setEditedContent(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <Rating
                                                value={review.rating}
                                                readOnly
                                            />
                                            <Link
                                                href={`/detail/${media_type}/${media_id}/review/${review.id}`}>
                                                <Typography
                                                    variant={'body2'}
                                                    color={'text.secondary'}
                                                    paragraph>
                                                    {review.content}
                                                </Typography>
                                            </Link>
                                        </>
                                    )}
                                    <Grid
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                        }}>
                                        {editMode === review.id ? (
                                            <Button
                                                onClick={() =>
                                                    handleConfirmEdit(review.id)
                                                }
                                                disabled={isEditButtonDisabled}>
                                                編集確定
                                            </Button>
                                        ) : (
                                            <ButtonGroup>
                                                <Button
                                                    onClick={() =>
                                                        handleEdit(review)
                                                    }>
                                                    編集
                                                </Button>
                                                <Button
                                                    color="error"
                                                    onClick={() =>
                                                        handleDelete(review.id)
                                                    }>
                                                    削除
                                                </Button>
                                            </ButtonGroup>
                                        )}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
            <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 5 }}>
                <Tooltip title="レビューを追加する">
                    <Fab
                        style={{ backgroundColor: '#1976d2', color: 'white' }}
                        onClick={handleOpen}>
                        <AddIcon />
                    </Fab>
                </Tooltip>
            </Box>

            {/* モーダル ウィンドウ*/}
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}>
                    <Typography variant="h6" component="h2">
                        レビューを追加する
                    </Typography>
                    <Rating
                        required
                        onChange={handleRatingChange}
                        value={rating}
                    />
                    <TextareaAutosize
                        required
                        minRows={5}
                        placeholder="レビュー内容"
                        style={{
                            width: '100%',
                            marginTop: '10px',
                        }}
                        onChange={handleReviewChange}
                        value={review}
                    />

                    <Button
                        variant="outlined"
                        disabled={isReviewButtonDisabled}
                        onClick={handleReviewAdd}>
                        送信
                    </Button>
                </Box>
            </Modal>
        </AppLayout>
    )
}

//SSG,SSR,CSR

export async function getServerSideProps(context) {
    const { media_type, media_id } = context.params
    try {
        const jpResponse = await axios.get(
            `https://api.themoviedb.org/3/${media_type}/${media_id}?api_key=${process.env.TMDB_API_KEY}&language=ja-JP`,
        )
        let combinedData = { ...jpResponse.data }
        if (!jpResponse.data.overview) {
            const enResponse = await axios.get(
                `https://api.themoviedb.org/3/${media_type}/${media_id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
            )
            combinedData.overview = enResponse.data.overview
        }

        return {
            props: {
                detail: combinedData,
                media_type: media_type,
                media_id: media_id,
            },
        }
    } catch (error) {
        return { notFound: true }
    }
}

export default Detail
