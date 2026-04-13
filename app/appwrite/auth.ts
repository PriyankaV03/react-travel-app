import {account, appwriteConfig, tables} from "~/appwrite/client";
import {ID, OAuthProvider, Query} from "appwrite";
import {redirect} from "react-router";

export const loginWithGoogle = async () => {
    try {
        account.createOAuth2Session({
            provider: OAuthProvider.Google,
            success: `${window.location.origin}/`,
            failure: `${window.location.origin}/sign-in`
        })
    } catch (error) {
        console.log('Error during OAuth2 session creation', error);
    }
}

export const getUser = async () => {
    try {
        const user = await account.get();

        if (!user) return redirect('/sign-in');
        const {rows: documents} = await tables.listRows({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.userCollectionId,
            queries: [
                Query.equal('accountId', user.$id),
                Query.select(['name', 'email', 'imageUrl', 'joinedAt', 'accountId'])
            ]
        })

        return documents.length > 0 ? documents[0] : redirect('/sign-in');
    } catch (error: any) {
        if (error.code !== 401) {
            console.log("Error while Fetching user:", error);
        }
        return null;
    }
}

export const logoutUser = async () => {
    try {
        await account.deleteSession({sessionId: 'current'});
    } catch (error) {
        console.log("logout error: ", error);
    }
}

export const getGooglePicture = async (accessToken: string) => {
    try {
        const response = await fetch('https://people.googleapis.com/v1/people/me?personFields=photos', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            console.error('Google People API error:', await response.text());
            return null;
        }

        const {photos} = await response.json();
        return photos?.[0]?.url || null;
    } catch (error) {
        console.error('Error fetching Google Picture', error);
        return null;
    }
}

export const storeUserData = async () => {
    try {
        const user = await account.get();
        if (!user) return null;

        const {providerAccessToken} = (await account.getSession({sessionId: 'current'})) || {};
        const profilePicture = providerAccessToken ? await getGooglePicture(providerAccessToken) : null;

        const createdUser = await tables.createRow({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.userCollectionId,
            rowId: ID.unique(),
            data: {
                accountId: user.$id,
                email: user.email,
                name: user.name,
                imageUrl: profilePicture,
                joinedAt: new Date().toISOString()
            }
        })
        if (!createdUser.$id) redirect('/sign-in');
    } catch (error) {
        console.error('Error storing user data:', error);
    }
}

export const getExistingUser = async (accountId: string) => {
    try {
        const {rows: documents, total} = await tables.listRows({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.userCollectionId,
            queries: [
                Query.equal('accountId', accountId)
            ]
        });

        return total > 0 ? documents[0] : null;
    } catch (error) {
        console.error('Error fetching user', error);
        return null;
    }
}

export const getAllUsers = async (limit: number, offset: number) => {
    try {
        const {rows: users, total} = await tables.listRows({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.userCollectionId,
            queries: [
                Query.limit(limit), Query.offset(offset)
            ]
        })
        if (total === 0) return {users: [], total};

        const mappedUsers = users.map((user: any) => ({
            id: user.$id,
            name: user.name,
            email: user.email,
            imageUrl: user.imageUrl,
            joinedAt: user.dateJoined,
            itineraryCreated: user.itineraryCreated ?? 0,
            status: user.status ?? "user",
        }));

        return {users: mappedUsers, total};
    } catch (error) {
        console.error('Error fetching all users', error);
        return {users: [], total: 0};
    }
}