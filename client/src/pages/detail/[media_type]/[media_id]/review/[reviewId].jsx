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
const Review = () => {
    const [review, setReview] = useState(null)
    const [comment, setComments] = useState([])
    const router = useRouter()
    const { reviewId } = router.query
    console.log(reviewId)
    useEffect(() => {
        const fetchReview = async () => {
            try {
                const response = await laravelAxios.get(
                    `/api/review/${reviewId}`,
                )
                console.log(response.data)
                setReview(response.data)
                setComments(response.data.comments)
            } catch (error) {
                console.log(error)
            }
        }
        fetchReview()
    }, [reviewId])
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
                {review && (
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
                    </>
                )}
            </Container>

            <div>
                <h1>レビュー内容</h1>
            </div>
        </AppLayout>
    )
}

export default Review
