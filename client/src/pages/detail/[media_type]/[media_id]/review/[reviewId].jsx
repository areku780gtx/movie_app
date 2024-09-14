import React, { use } from 'react'
import AppLayout from '@/components/Layout/AppLayout'
import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import laravelAxios from '@/lib/laravelAxios'
import { Rating } from '@mui/material'
import { Typography } from '@mui/material'
import { Card } from '@mui/material'
import { CardContent } from '@mui/material'
import { Container } from '@mui/material'
import { useState } from 'react'
import CommentList from '@/components/CommentList'
import { Button } from '@mui/material'
import { TextField } from '@mui/material'
import { Box } from '@mui/material'
const ReviewDetail = () => {
    const [review, setReview] = useState(null)
    const [comments, setComments] = useState([])
    const [content, setContent] = useState('')
    const router = useRouter()
    const { reviewId } = router.query
    console.log(reviewId)
    useEffect(() => {
        if (!reviewId) return
        const fetchReview = async () => {
            try {
                const response = await laravelAxios.get(
                    `/api/review/${reviewId}`,
                )
                console.log(response.data)
                setReview(response.data)
                setComments(response.data.comments)
                console.log(comments)
            } catch (error) {
                console.log(error)
            }
        }
        fetchReview()
    }, [reviewId])
    const handleChange = e => {
        setContent(e.target.value)
        console.log(content)
    }
    const handleCommentAdd = async e => {
        e.preventDefault()
        const trimmedContent = content.trim()
        if (!trimmedContent) {
            return
        }
        try {
            const response = await laravelAxios.post(`/api/comments`, {
                content: trimmedContent,
                review_id: reviewId,
            })
            console.log(response.data)
            const newComment = response.data
            setComments([...comments, newComment])
            setContent('')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Home
                </h2>
            }>
            <Head>
                <title>Laravel - Home</title>
            </Head>
            <Container sx={{ py: 2 }}>
                {review ? (
                    <>
                        <Card sx={{ minHeight: 2 }}>
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    component="div"
                                    gutterBottom>
                                    {review.user.name}
                                </Typography>
                                <Rating
                                    name="read-only"
                                    value={review.rating}
                                    readOnly
                                />
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    component="p">
                                    {review.content}
                                </Typography>
                            </CardContent>
                        </Card>

                        <Box
                            onSubmit={handleCommentAdd}
                            component="form"
                            noValidate
                            autoComplete="off"
                            p={2}
                            sx={{
                                mb: 2,
                                display: 'flex',
                                alignItems: 'flex-start',
                                bgcolor: 'black',
                            }}>
                            <TextField
                                inputProps={{ maxLength: 200 }}
                                error={content.length > 200}
                                helperText={
                                    content.length > 200
                                        ? '200文字を超えています'
                                        : ''
                                }
                                fullWidth
                                label="comment"
                                variant="outlined"
                                value={content}
                                onChange={handleChange}
                                sx={{ mr: 1, flexGrow: 1 }}
                            />
                            <Button
                                variant="contained"
                                type="submit"
                                style={{
                                    backgroundColor: '#1976d2',
                                    color: '#fff',
                                }}>
                                送信
                            </Button>
                        </Box>

                        <CommentList
                            comments={comments}
                            setComments={setComments}
                        />
                    </>
                ) : (
                    <div>読み込み中...</div>
                )}
            </Container>

            <div>
                <h1>レビュー内容</h1>
            </div>
        </AppLayout>
    )
}

export default ReviewDetail
