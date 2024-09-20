import React, { useState } from 'react'
import Comment from './Comment'
import { Grid } from '@mui/material'
import laravelAxios from '../lib/laravelAxios'
const CommentList = ({ comments, setComments }) => {
    const [editMode, setEditMode] = useState(null)
    const [editedContent, setEditedContent] = useState('')
    console.log(comments)
    const handleDelete = async commentId => {
        try {
            if (!laravelAxios) {
                console.error('laravelAxiosが未定義です')
                return
            }
            const response = await laravelAxios.delete(
                `/api/comments/${commentId}`,
            )

            console.log(response.data)

            const FilteredComments = comments.filter(
                comment => comment.id !== commentId,
            )
            setComments(FilteredComments)
        } catch (error) {
            console.log(error)
        }
    }
    const handleEdit = async comment => {
        console.log(comment)
        setEditMode(comment.id)
        setEditedContent(comment.content)
    }
    const handleConfirmEdit = async commentId => {
        try {
            if (!laravelAxios) {
                console.error('laravelAxiosが未定義です')
                return
            }
            const response = await laravelAxios.put(
                `/api/comments/${commentId}`,
                { content: editedContent },
            )

            console.log(response.data)
            const updatedComment = response.data
            const updatedComments = comments.map(comment => {
                if (comment.id === commentId) {
                    return { ...comment, content: response.data.content }
                }
                return comment
            })
            setComments(updatedComments)
            console.log(updatedComments)
            setEditMode(null)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <Grid container spacing={2} sx={{ mt: 2 }}>
                {comments.map(comment => (
                    <Grid item xs={12} key={comment.id}>
                        <Comment
                            comment={comment}
                            onDelete={handleDelete}
                            handleEdit={handleEdit}
                            editMode={editMode}
                            editedContent={editedContent}
                            handleConfirmEdit={handleConfirmEdit}
                            setEditedContent={setEditedContent}
                        />
                    </Grid>
                ))}
            </Grid>
        </div>
    )
}
export default CommentList
