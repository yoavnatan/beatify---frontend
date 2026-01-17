export function getBlankStation(user) {
    return {
        name: 'New Playlist',
        imgUrl: '../public/img/blank-screen.jpg',
        averageColor: 'rgba(47, 38, 89, 0.9)',
        createdBy: 
        { fullname: user.fullname,
          _id:user._id
         },
        songs: [],
        tags:['Indie','Chill','Alternative']
    }
}
