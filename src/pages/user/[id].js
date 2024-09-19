import ListLike from "src/components/listLike";
import {useUser} from "@/contexts/userContext";

const UserPage = () => {
    const {userData} = useUser();

    return (
        <>
            {userData?.likedTrackData && <ListLike data={userData.likedTrackData}/>}
        </>
    )
}

export default UserPage

