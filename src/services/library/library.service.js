export function getBlankStation(user) {
    return {
        name: 'My Playlist',
        imgUrl: '/img/blank-screen.png',
        description: "bla bla bla",
        description: "",
        averageColor: 'rgba(52, 52, 52, 0.5)',
        createdBy:
        {
            fullname: user.fullname,
            _id: user._id
        },
        songs: [],
        tags: []
    }
}


