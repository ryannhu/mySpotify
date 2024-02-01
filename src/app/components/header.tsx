'use client'

const Header = () => {
    return (
        <div className="fixed bottom-0 w-full bg-gray-800 text-white p-4">
            <nav className="flex justify-around">
                <a href={process.env.CURRENT_URL + `/tracks`} className="hover:text-green-500">Tracks</a>
                <a href={process.env.CURRENT_URL + '/artists'} className="hover:text-green-500">Artists</a>
                <a href={process.env.CURRENT_URL + `/home`} className="hover:text-green-500">Home</a>
                <a href={process.env.CURRENT_URL + `/playlists`} className="hover:text-green-500">Playlists</a>
            </nav>
        </div>
    );
}

export default Header;