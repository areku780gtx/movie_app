import React, { use } from 'react'
import AppLayout from '@/components/Layout/AppLayout'
import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
const Review = () => {
    const router = useRouter()
    const { reviewId } = router.query
    console.log(reviewId)
    useEffect(() => {
        const fetchReview = async () => {
            try {
                const response = await laravel.get(`/api/reviews/${reviewId}`)
            } catch (error) {}
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
            <div>
                <h1>レビュー内容</h1>
            </div>
        </AppLayout>
    )
}

export default Review
