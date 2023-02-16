type navItems = Array<{
  type: string
  more?: string | undefined
}>
type articleNavItems = Array<{
  categoryName: string // 显示
  category: string // 实际查询用
  tags: string[]
}>

interface articleMeta{
  id: string
  category: string
  tags: string[]
  title: string
  briefContent: string
  img: string,
  author: {
    name: string
    avatar: string
    id: string
  }
  createTime: number
  hotIndex: number
  viewCount: number
  agreeCount: number
  commentCount: number
}

interface articleDetail extends articleMeta {
  content: string
}
