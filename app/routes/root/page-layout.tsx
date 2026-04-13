// import {useNavigate} from "react-router";
// import {logoutUser} from "~/appwrite/auth";
//
// const PageLayout = () => {
//
//     const navigate = useNavigate();
//
//     const handleLogout = async () => {
//         await logoutUser();
//         navigate('/sign-in');
//     }
//
//     return (
//         <div>
//             <button onClick={handleLogout}
//                     className="cursor-pointer">
//                 <img src="/assets/icons/logout.svg" alt="logout" className="size-6"/>
//             </button>
//
//             <button onClick={() => {
//                 navigate('/dashboard')
//             }}>
//                 Dashboard
//             </button>
//         </div>
//     )
// }
//
// export default PageLayout;

import {Outlet, redirect} from "react-router";
import {getExistingUser, storeUserData} from "~/appwrite/auth";
import {account} from "~/appwrite/client";
import {RootNavbar} from "~/components";


export async function clientLoader() {
    try {
        const user = await account.get();

        if (!user.$id) return redirect('/sign-in');

        const existingUser = await getExistingUser(user.$id);
        return existingUser?.$id ? existingUser : await storeUserData();
    } catch (e) {
        console.log('Error fetching user', e)
        return redirect('/sign-in')
    }
}

const PageLayout = () => {
    return (
        <div className="bg-light-200">
            <RootNavbar/>
            <Outlet/>
        </div>
    )
}
export default PageLayout