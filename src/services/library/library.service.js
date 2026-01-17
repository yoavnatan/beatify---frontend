export function getBlankStation(user) {
    return {
        name: 'My Playlist',
        imgUrl: '/img/blank-screen.jpg',
        description: "bla bla bla",
        description: "",
        averageColor: 'rgba(47, 38, 89, 0.9)',
        createdBy:
        {
            fullname: user.fullname,
            _id: user._id
        },
        songs: [],
        tags: []
    }
}
