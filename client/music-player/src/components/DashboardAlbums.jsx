import { useEffect } from "react";
import { useStateValue } from "../contexts/StateProvider";

import { actionType } from "../contexts/reducer";
import { getAllAlbums } from "../api/index";
import SongCard from "./SongCard";

const DashboardAlbums = () => {
  const [{ allAlbums }, dispatch] = useStateValue();

  useEffect(() => {
    if (!allAlbums) {
      getAllAlbums().then((data) => {
        // console.log()
        dispatch({ type: actionType.SET_ALL_ALBUMS, allAlbums: data });
      });
    }
  }, [allAlbums, dispatch]);

  return (
    <div className="w-full p-4 flex items-center justify-center flex-col">
      <div className="relative w-full gap-3  my-4 p-4 py-12 border border-gray-300 rounded-md flex flex-wrap justify-evenly">
        {/* {allArtists &&
          allArtists.map((data, index) => {
            return <>{<ArtistContainer data={allArtists} />}</>;
          })} */}
        <AlbumContainer data={allAlbums} />
      </div>
    </div>
  );
};

// eslint-disable-next-line react/prop-types
export const AlbumContainer = ({ data }) => {
  return (
    <div className="w-full flex flex-wrap gap-3 items-center justify-evenly">
      {data &&
        // eslint-disable-next-line react/prop-types
        data?.map((song, i) => (
          <SongCard key={song._id} data={song} index={i} type="album" />
        ))}
    </div>
  );
};

export default DashboardAlbums;
