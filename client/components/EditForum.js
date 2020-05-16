import PleaseSignIn from './PleaseSignIn'

const EDIT_FORUM_QUERY = gql`
query EDIT_FORUM_QUERY($url: String) {
  allForums(where: {
    url: $url
  }) {
    id
    name
    url
    description
    colorScheme
    isBanned
    bannedUsers {
      id
    }
    icon {
      publicUrlTransformed(transformation: {
        width:"200",
        height:"200",
        crop:"fill",
        gravity:"center"
      })
    }
    owner {
      id
      name
    }
    moderators {
      id
      name
    }
  }
}
`

const EditForum = () => {
  return (
    <PleaseSignIn>
      Edit forum
    </PleaseSignIn>
  )
}

export default EditForum
