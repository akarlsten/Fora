
const ForumList = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-4" style={{ justifyItems: 'center' }}>
    {children}
  </div>
)

export default ForumList
