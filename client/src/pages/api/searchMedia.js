import axios from 'axios'

export default async (req, res) => {
    const { searchQuery } = req.query
    console.log(`出力結果は${searchQuery}です`)
    if (!searchQuery) {
        return res.status(400).json({ message: '検索文字列がありません' })
    }

    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/search/multi?api_key=${
                process.env.TMDB_API_KEY
            }&query=${encodeURIComponent(searchQuery)}&language=ja-JP`,
        )
        console.log(response.data.results)

        return res.json(response.data)
    } catch (error) {
        console.error('エラーが発生しました', error)
        return res
            .status(500)
            .json({ message: 'サーバー側でエラーが発生しました' })
    }
}
